package api

import (
	"net/http"
	"fmt"

	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	//"k8s.io/apimachinery/pkg/util/intstr"
	apiv1 "k8s.io/api/core/v1"
	//appsv1 "k8s.io/api/apps/v1"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	log "github.com/golang/glog"
	//"github.com/jinzhu/gorm"
	//"github.com/google/uuid"
	"k8s.io/apimachinery/pkg/api/resource"
	"time"
)

var exposePort = map[string]int32{
	"web":     80,
	"jupyter": 8888,
	"digitis": 5000,
	"ssh":     22,
	//"svc1":    6006,
	//"svc2":    5566,
}

// todo: determine cpu & memory limit automatically, not hard code
var defaultResourceLimit = apiv1.ResourceList{
	apiv1.ResourceMemory: resource.MustParse("64Mi"),
	apiv1.ResourceCPU:    resource.MustParse("500m"),
}

const (
	JoBStatusCreated string = "Created"
	JoBStatueReady   string = "Ready"
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

func (resourceClient *ResourceClient) isJobReady(c *gin.Context) {
	jobid := c.Param("jobid")

	if jobid == "" {
		log.Errorf("job id is not found")
		util.RespondWithError(c, http.StatusBadRequest, "job id is not found")
		return
	}

	deploymentsClient := resourceClient.K8sClient.AppsV1().Deployments(apiv1.NamespaceDefault)
	deploy, err := deploymentsClient.Get(jobid, metav1.GetOptions{})

	if err != nil {
		errStr := fmt.Sprintf("Get deployment {%s} fail: %s", jobid, err.Error())
		log.Errorf(errStr)
		util.RespondWithError(c, http.StatusInternalServerError, errStr)
		return
	}

	// if replica not enough, return not ready
	if deploy.Status.AvailableReplicas != deploy.Status.Replicas {
		c.JSON(http.StatusOK, model.LaunchCourseResponse{
			Error: false,
			Job: model.JobStatus{
				JobId:  jobid,
				Ready:  false,
				Status: JoBStatusCreated,
			},
		})
		return
	}

	// update Job status in Job Table
	jobObj := model.Job{
		Model: model.Model{
			ID: jobid,
		},
	}
	err = resourceClient.DB.Model(&jobObj).Update("status", JoBStatueReady).Error
	if err != nil {
		errStr := fmt.Sprintf("update job {%s} status fail: %s", jobid, err.Error())
		log.Errorf(errStr)
		util.RespondWithError(c, http.StatusInternalServerError, errStr)
		return
	}

	c.JSON(http.StatusOK, model.LaunchCourseResponse{
		Error: false,
		Job: model.JobStatus{
			JobId:  jobid,
			Ready:  true,
			Status: JoBStatueReady,
		},
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

// todo: find ports in svc, we only return port which is available,
// use goroutine check port at the same time
func checkJobStatus(job_id string) {
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()
	ch := make(chan int, 10)
	for {
		select {
		case <-ch:
			fmt.Println(ch) // if ch not empty, time.After will nerver exec
			fmt.Println("sleep one seconds ...")
			time.Sleep(1 * time.Second)
			fmt.Println("sleep one seconds end...")
		default: // forbid block
		}
		select {
		case <-ticker.C:
			fmt.Println("timeout")
			return
		default: // forbid block
		}
	}

	return
}
