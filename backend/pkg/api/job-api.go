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
	"k8s.io/apimachinery/pkg/api/resource"
)

var exposePort = map[string]int32{
	"web":     80,
	"jupyter": 8888,
	"digitis": 5000,
	"ttyd":    7681,
}

// todo: determine cpu & memory limit automatically, not hard code
var defaultResourceLimit = apiv1.ResourceList{
	apiv1.ResourceMemory: resource.MustParse("64Mi"),
	apiv1.ResourceCPU:    resource.MustParse("500m"),
}

// todo: Do we need define Job lifecycle ?
const (
	JoBStatusCreated = "Created"
	JoBStatusPending = "Pending"
	JoBStatueReady   = "Ready"
)

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
		nodePorts, err := findServiceNodePort(resourceClient.K8sClient, result,
			resourceClient.config.GetString("kubernetes.expose_ip"))
		if err != nil {
			errStr := fmt.Sprintf("Parse Service info for job {%s} fail: %s", result.ID, err.Error())
			log.Errorf(errStr)
			util.RespondWithError(c, http.StatusInternalServerError, errStr)
			return
		}

		jobInfo := model.JobInfo{
			Id:           result.ID,
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

	if err := resourceClient.DB.First(&job).Error; err != nil {
		return fmt.Sprintf("Failed to find job {%s} information : %s", jobId, err.Error()), err
	}

	if err := deleteDeployment(resourceClient.K8sClient, jobId); err != nil {
		return fmt.Sprintf("Failed to delete deployment {%s}: %s", jobId, err.Error()), nil
	}

	if err := deleteService(resourceClient.K8sClient, job.Service); err != nil {
		return fmt.Sprintf("Failed to delete service {%s}: %s", job.Service, err.Error()), nil
	}

	if err := resourceClient.DB.Unscoped().Delete(&job).Error; err != nil {
		return fmt.Sprintf("Failed to delete job {%s} information : %s", jobId, err.Error()), nil
	}

	return "", nil
}

// todo: how to kill goroutine if job is deleted by hand
func (resourceClient *ResourceClient) checkJobStatus(jobId, svcName string) {

	deploymentsClient := resourceClient.K8sClient.AppsV1().Deployments(apiv1.NamespaceDefault)
	jobObj := model.Job{
		Model: model.Model{
			ID: jobId,
		},
	}
	var deploy *appsv1.Deployment
	var svc *apiv1.Service
	var err error

	// wait until deployment is ready
	for {
		deploy, err = deploymentsClient.Get(jobId, metav1.GetOptions{})
		if err != nil {
			log.Warning("Get deployment {%s} fail: %s", jobId, err.Error())
			time.Sleep(10 * time.Second)
			continue
		}

		if deploy.Status.AvailableReplicas != deploy.Status.Replicas {
			log.Warningf("Wait until deployment {%s} replica to {%d}, current replica is {%d}",
				jobId, deploy.Status.Replicas, deploy.Status.AvailableReplicas)

			if err := resourceClient.DB.Model(&jobObj).Update("status", JoBStatusPending).Error; err != nil {
				log.Error("update job {%s} status to %s fail: %s", jobId, JoBStatusPending, err.Error())
			}
			time.Sleep(10 * time.Second)
			continue
		}
		break
	}

	svcClient := resourceClient.K8sClient.CoreV1().Services(apiv1.NamespaceDefault)
	for {
		svc, err = svcClient.Get(svcName, metav1.GetOptions{})
		if err != nil {
			log.Errorf("Get service {%s} fail: %s", svcName, err.Error())
			time.Sleep(10 * time.Second)
			continue
		}
		break
	}

	exposeip := resourceClient.config.GetString("kubernetes.expose_ip")
	var newPorts []apiv1.ServicePort

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
		log.Error("update svc {%s} nodePort fail: %s", svc.Name, err.Error())
		return
	}

	if err := resourceClient.DB.Model(&jobObj).Update("status", JoBStatueReady).Error; err != nil {
		log.Error("update job {%s} status to %s fail: %s", jobId, JoBStatueReady, err.Error())
	}

}
