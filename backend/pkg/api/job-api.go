package api

import (
	"net/http"
	"fmt"
	"time"
	"net"
	"strings"

	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	apiv1 "k8s.io/api/core/v1"
	appsv1 "k8s.io/api/apps/v1"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	log "github.com/golang/glog"
)

// todo: Do we need define Job lifecycle ?
const (
	JoBStatusCreated = "Created"
	JoBStatusPending = "Pending"
	JoBStatueReady   = "Ready"
)

// @Summary Delete a running job deployment in user namespace
// @Description Delete a running job deployment in user namespace
// @Tags Job
// @Accept  json
// @Produce  json
// @Param id path string true "job uuid, eg: 131ba8a9-b60b-44f9-83b5-46590f756f41"
// @Success 200 {object} docs.GenericOKResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 401 {object} docs.GenericErrorResponse
// @Failure 403 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Security ApiKeyAuth
// @Router /v1/job/delete/{id} [delete]
func (resourceClient *ResourceClient) DeleteJob(c *gin.Context) {
	jobId := c.Param("id")

	if jobId == "" {
		util.RespondWithError(c, http.StatusBadRequest,
			"Job Id is empty")
		return
	}

	if errStr, err := resourceClient.deleteJobDeploymentAndSvc(jobId); err != nil {
		util.RespondWithError(c, http.StatusInternalServerError, errStr)
		return
	}

	util.RespondWithOk(c, "Job {%s} is deleted successfully", jobId)
}


// @Summary List all running course deployment for a user
// @Description List all running course deployment for a user
// @Tags Job
// @Accept  json
// @Produce  json
// @Param list_user body docs.OauthUser true "search user's job"
// @Success 200 {object} docs.JobListResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 401 {object} docs.GenericErrorResponse
// @Failure 403 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Security ApiKeyAuth
// @Router /v1/job/list [post]
func (resourceClient *ResourceClient) ListJob(c *gin.Context) {

	provider, exist := c.Get("Provider")
	if exist == false {
		provider = ""
	}

	req := model.Job{}
	err := c.BindJSON(&req)
	if err != nil {
		log.Errorf("Failed to parse spec request request: %s", err.Error())
		util.RespondWithError(c, http.StatusBadRequest, "Failed to parse spec request request: %s", err.Error())
		return
	}

	if req.User == "" {
		log.Errorf("Empty user name")
		util.RespondWithError(c, http.StatusBadRequest, "Empty user name")
		return
	}

	job := model.Job{
		OauthUser: model.OauthUser{
			User:     req.User,
			Provider: provider.(string),
		},
	}

	resultJobs := []model.Job{}
	err = resourceClient.DB.Where(&job).Find(&resultJobs).Error

	if err != nil {
		strErr := fmt.Sprintf("Query Job table for user {%s} fail: %s", req.User, err.Error())
		log.Errorf(strErr)
		util.RespondWithError(c, http.StatusInternalServerError, strErr)
		return
	}

	namespace := resourceClient.K8sClient.namespace
	jobList := []model.JobInfo{}
	for _, result := range resultJobs {
		// find course information
		courseInfo, err := findCourse(resourceClient.DB, result)
		if err != nil {
			errStr := fmt.Sprintf("Query Course info for job {%s} fail: %s", result.ID, err.Error())
			log.Errorf(errStr)
			util.RespondWithError(c, http.StatusInternalServerError, errStr)
			return
		}

		// find nodeport information
		nodePorts, err := findServiceNodePort(resourceClient.K8sClient.KClientSet, result,
			resourceClient.config.GetString("kubernetes.expose_ip"), namespace)
		if err != nil {
			errStr := fmt.Sprintf("Parse Service info for job {%s} fail: %s", result.ID, err.Error())
			log.Errorf(errStr)
			util.RespondWithError(c, http.StatusInternalServerError, errStr)
			return
		}

		jobInfo := model.JobInfo{
			Id:           result.ID,
			CourseID:     courseInfo.ID,
			StartAt:      result.CreatedAt,
			Status:       result.Status,
			Name:         courseInfo.Name,
			Introduction: courseInfo.Introduction,
			Image:        courseInfo.Image,
			Level:        courseInfo.Level,
			GPU:          courseInfo.Gpu,
			Dataset:      courseInfo.Datasets,
			Service:      nodePorts,
		}

		jobList = append(jobList, jobInfo)
	}

	c.JSON(http.StatusOK, model.JobListResponse{
		Error: false,
		Jobs:  jobList,
	})
}

func (resourceClient *ResourceClient) deleteJobDeploymentAndSvc(jobId string) (string, error) {
	job := model.Job{
		Model: model.Model{
			ID: jobId,
		},
	}
	namespace := resourceClient.K8sClient.namespace
	if err := resourceClient.DB.First(&job).Error; err != nil {
		return fmt.Sprintf("Failed to find job {%s} information : %s", jobId, err.Error()), err
	}

	if err := deleteDeployment(resourceClient.K8sClient.KClientSet, jobId, namespace); err != nil {
		return fmt.Sprintf("Failed to delete deployment {%s}: %s", jobId, err.Error()), nil
	}

	if err := deleteService(resourceClient.K8sClient.KClientSet, job.Service, namespace); err != nil {
		return fmt.Sprintf("Failed to delete service {%s}: %s", job.Service, err.Error()), nil
	}

	if err := resourceClient.DB.Unscoped().Delete(&job).Error; err != nil {
		return fmt.Sprintf("Failed to delete job {%s} information : %s", jobId, err.Error()), nil
	}

	return "", nil
}

func (resourceClient *ResourceClient) checkJobStatus(jobId, svcName string) {

	namespace := resourceClient.K8sClient.namespace
	deploymentsClient := resourceClient.K8sClient.KClientSet.AppsV1().Deployments(namespace)
	jobObj := model.Job{
		Model: model.Model{
			ID: jobId,
		},
	}
	var deploy *appsv1.Deployment
	var svc *apiv1.Service
	var err error

	isDeploymentDeleted := false
	isServiceDeleted := false

	// wait until deployment is ready
	for {
		deploy, err = deploymentsClient.Get(jobId, metav1.GetOptions{})
		if err != nil {
			// error message ends with "not found", means deployment resource is not exist
			if strings.HasSuffix(err.Error(), "not found") {
				isDeploymentDeleted = true
				log.Warningf("deployment {%s} is not exist, maybe deleted already.", jobId)
				break
			}

			log.Warningf("Get deployment {%s} fail: %s", jobId, err.Error())
			time.Sleep(10 * time.Second)
			continue
		}

		// deployment is being deleted in error message check, we can check replica
		if deploy.Status.Replicas == 0 {
			isDeploymentDeleted = true
			log.Warningf("deployment {%s} is not exist, maybe deleted already.", jobId)
			break
		}

		if deploy.Status.AvailableReplicas != deploy.Status.Replicas {
			log.Warningf("Wait until deployment {%s} replica to {%d}, current replica is {%d}",
				jobId, deploy.Status.Replicas, deploy.Status.AvailableReplicas)

			if err := resourceClient.DB.Model(&jobObj).Update("status", JoBStatusPending).Error; err != nil {
				log.Errorf("update job {%s} status to %s fail: %s", jobId, JoBStatusPending, err.Error())
			}
			time.Sleep(10 * time.Second)
			continue
		}
		break
	}

	svcClient := resourceClient.K8sClient.KClientSet.CoreV1().Services(namespace)
	for {
		svc, err = svcClient.Get(svcName, metav1.GetOptions{})
		if err != nil {
			if strings.HasSuffix(err.Error(), "not found") {
				isServiceDeleted = true
				log.Warningf("service {%s} is not exist, maybe deleted already.", jobId)
				break
			}

			log.Warningf("Get service {%s} fail: %s", svcName, err.Error())
			time.Sleep(10 * time.Second)
			continue
		}
		break
	}

	if isDeploymentDeleted == true || isServiceDeleted == true {
		log.Infof("deployment {%s} or service {%s} is not exist, checkJobStatus() finish.", jobId, svcName)
		return
	}

	exposeip := resourceClient.config.GetString("kubernetes.expose_ip")
	var newPorts []apiv1.ServicePort

	// todo: user must specify desired port number (#42)
	time.Sleep(45 * time.Second)
	// check every nodePort, only keep reachable one
	for _, p := range svc.Spec.Ports {
		svcIp := strings.TrimPrefix(fmt.Sprintf("%s:%d", exposeip, p.NodePort), "http://")
		timeout := time.Duration(2 * time.Second)
		conn, err := net.DialTimeout("tcp", svcIp, timeout)
		if err != nil {
			log.Infof("%s [%s] is not reachable", svcIp, p.Name)
			continue
		}
		conn.Close()
		log.Infof("%s [%s] is reachable, add to service nodeport", svcIp, p.Name)
		sp := p
		newPorts = append(newPorts, sp)
	}

	svc.Spec.Ports = newPorts
	if _, err = svcClient.Update(svc); err != nil {
		log.Errorf("update svc {%s} nodePort fail: %s", svc.Name, err.Error())
		return
	}

	if err := resourceClient.DB.Model(&jobObj).Update("status", JoBStatueReady).Error; err != nil {
		log.Errorf("update job {%s} status to %s fail: %s", jobId, JoBStatueReady, err.Error())
	}

}


// @Summary Create a course deployment in kubernetes
// @Description Create a course deployment in kubernetes
// @Tags Job
// @Accept  json
// @Produce  json
// @Param launch_course body docs.LaunchCourseRequest true "course want to launch"
// @Success 200 {object} docs.LaunchCourseResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 401 {object} docs.GenericErrorResponse
// @Failure 403 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Security ApiKeyAuth
// @Router /v1/job/launch [post]
func (resourceClient *ResourceClient) LaunchJob(c *gin.Context) {

	var req model.LaunchCourseRequest
	err := c.BindJSON(&req)
	if err != nil {
		log.Errorf("Failed to parse spec request request: %s", err.Error())
		util.RespondWithError(c, http.StatusBadRequest, "Failed to parse spec request request: %s", err.Error())
		return
	}

	user := req.User
	if user == "" {
		log.Errorf("user field in request cannot be empty")
		util.RespondWithError(c, http.StatusBadRequest, "user field in request cannot be empty")
		return
	}

	provider, exist := c.Get("Provider")
	if !exist {
		log.Warning("Provider is not found in request context, set empty")
		provider = ""
	}

	namespace := resourceClient.K8sClient.namespace
	//Step 1: retrive required information
	//	Step 1-1: find course object by course_id
	course := getCourseObject(resourceClient.DB, req.CourseId)
	if course == nil {
		log.Errorf("Query course id %s fail", req.CourseId)
		util.RespondWithError(c, http.StatusInternalServerError,
			"Query course id %s fail", req.CourseId)
		return
	}

	// 	Step 1-2: find dataset required by course
	datasets := getRequiredDataset(resourceClient.DB, req.CourseId)
	if datasets == nil {
		log.Errorf("Query course id %s required dataset fail", req.CourseId)
		util.RespondWithError(c, http.StatusInternalServerError,
			"Query course id %s required dataset fail", req.CourseId)
		return
	}

	// Step 2: create kubernetes resources
	// 	Step 2-1: create deployment
	deployment, err := createDeployment(resourceClient.K8sClient.KClientSet, course, datasets,
		namespace, resourceClient.K8sClient.exposePort, resourceClient.K8sClient.defaultResourceLimit.DeepCopy())

	if err != nil {
		errStrt := fmt.Sprintf("create deployment for course {id = %s} fail: %s", course.ID, err.Error())
		log.Errorf(errStrt)
		util.RespondWithError(c, http.StatusInternalServerError, errStrt)
		return
	}

	// 	Step 2-2: create service
	svc, err := createService(resourceClient.K8sClient.KClientSet, deployment.Name,
		namespace, resourceClient.K8sClient.exposePort)
	if err != nil {
		//todo : rollback, need to delete deployment
		errStrt := fmt.Sprintf("create service for job {id = %s} fail: %s", deployment.Name, err.Error())
		log.Errorf(errStrt)
		util.RespondWithError(c, http.StatusInternalServerError, errStrt)
		return
	}

	// Step 3: update Job Table
	err = updateTable(resourceClient.DB, deployment, svc, course, user, provider.(string))
	if err != nil {
		//todo : rollback, need to delete svc and deployment
		errStrt := fmt.Sprintf("update Job Table for job {id = %s} fail: %s", deployment.Name, err.Error())
		log.Errorf(errStrt)
		util.RespondWithError(c, http.StatusInternalServerError, errStrt)
		return
	}

	// create a go routine to check job is ready or not
	go resourceClient.checkJobStatus(deployment.Name, svc.Name)

	c.JSON(http.StatusOK, model.LaunchCourseResponse{
		Error: false,
		Job: model.JobStatus{
			JobId:  deployment.Name,
			Ready:  false,
			Status: "Created",
		},
	})

}
