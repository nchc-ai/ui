package api

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"github.com/google/uuid"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	log "github.com/golang/glog"
)


func (resourceClient *ResourceClient) ListCourse(c *gin.Context) {
	provider, exist := c.Get("Provider")
	if exist == false {
		provider = ""
	}
	level := c.Param("level")

	req := model.Course{}
	var err error
	if level == "" {
		err := c.BindJSON(&req)
		if err != nil {
			log.Errorf("Failed to parse spec request request: %s", err.Error())
			util.RespondWithError(c, http.StatusBadRequest, "Failed to parse spec request request: %s", err.Error())
			return
		}
	}

	if req.User == "" {
		log.Errorf("Empty user name")
		util.RespondWithError(c, http.StatusBadRequest, "Empty user name")
		return
	}

	course := model.Course{
		OauthUser: model.OauthUser{
			User:     req.User,
			Provider: provider.(string),
		},
		Level: level,
	}

	results := []model.Course{}
	err = resourceClient.DB.Where(&course).Find(&results).Error
	if err != nil {
		log.Errorf("Query courses table fail: %s", err.Error())
		util.RespondWithError(c, http.StatusInternalServerError, "Query courses table fail: %s", err.Error())
		return
	}

	resp := []model.Course{}

	for _, result := range results {

		dataset := model.Dataset{
			CourseID: result.ID,
		}
		datasetResult := []model.Dataset{}
		err = resourceClient.DB.Where(&dataset).Find(&datasetResult).Error
		if err != nil {
			log.Errorf("Query datasets table fail: %s", err.Error())
			util.RespondWithError(c, http.StatusInternalServerError, "Query datasets table fail: %s", err.Error())
			return
		}

		courseDataset := []string{}

		for _, s := range datasetResult {
			courseDataset = append(courseDataset, s.DatasetName)
		}

		resp = append(resp, model.Course{
			Model: model.Model{
				ID:        result.ID,
				CreatedAt: result.CreatedAt,
			},
			Name:         result.Name,
			Introduction: result.Introduction,
			Image:        result.Image,
			Level:        result.Level,
			Gpu:          result.Gpu,
			Datasets:     courseDataset,
		})
	}

	c.JSON(http.StatusOK, model.ListCourseResponse{
		Error:   false,
		Courses: resp,
	})

}

func (resourceClient *ResourceClient) AddCourse(c *gin.Context) {

	var req model.Course
	err := c.BindJSON(&req)
	if err != nil {
		log.Errorf("Failed to parse spec request request: %s", err.Error())
		util.RespondWithError(c, http.StatusBadRequest, "Failed to parse spec request request: %s", err.Error())
		return
	}

	if req.User == "" {
		log.Errorf("user field in request cannot be empty")
		util.RespondWithError(c, http.StatusBadRequest, "user field in request cannot be empty")
		return
	}

	// add course information in DB
	courseID := uuid.New().String()

	provider, exist := c.Get("Provider")
	if !exist {
		log.Warning("Provider is not found in request context, set empty")
		provider = ""
	}

	newCourse := model.Course{
		Model: model.Model{
			ID: courseID,
		},
		OauthUser: model.OauthUser{
			User:     req.User,
			Provider: provider.(string),
		},
		Introduction: req.Introduction,
		Name:         req.Name,
		Image:        req.Image,
		Level:        req.Level,
		Gpu:          req.Gpu,
	}

	err = resourceClient.DB.Create(&newCourse).Error

	if err != nil {
		log.Errorf("Failed to create course information: %s", err.Error())
		util.RespondWithError(c, http.StatusInternalServerError, "Failed to create course information: %s", err.Error())
		return
	}

	// add dataset required by course in DB
	datasets := req.Datasets
	for _, data := range datasets {
		newDataset := model.Dataset{
			CourseID:    courseID,
			DatasetName: data,
		}
		err = resourceClient.DB.Create(&newDataset).Error
		if err != nil {
			log.Errorf("Failed to create course-dataset information in DB: %s", err.Error())
			util.RespondWithError(c, http.StatusInternalServerError, "Failed to create course-dataset information in DB: %s", err.Error())
			return
		}
	}

	util.RespondWithOk(c, "Course %s created successfully", req.Name)
}

// Step 1: Find all associated Deployment/Service (included launched by student) and stop in kubernetes
// 		Step 1-1: delete jobs in DB.  (With foreign key, this should be done automatically)
// 		Step 1-2: delete proxy in DB. (With foreign key, this should be done automatically)

// Step 2: Delete course in DB.

// Step 3: delete required dataset in DB. (With foreign key, this should be done automatically)
func (resourceClient *ResourceClient) DeleteCourse(c *gin.Context) {
	courseId := c.Param("id")

	if courseId == "" {
		util.RespondWithError(c, http.StatusBadRequest,
			"Course Id is not found")
		return
	}

	course := model.Course{
		Model: model.Model{
			ID: courseId,
		},
	}

	//todo: stop all deployment & service

	err := resourceClient.DB.Unscoped().Delete(&course).Error

	if err != nil {
		util.RespondWithError(c, http.StatusInternalServerError,
			"Failed to delete course {%s} information : %s", courseId, err.Error())
		return
	}

	util.RespondWithOk(c, "Course %s is deleted successfully", courseId)
}

func (resourceClient *ResourceClient) LaunchCourse(c *gin.Context) {

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

	//Step 1: retrive required information
	//	Step 1-1: find course object by course_id
	course := getCourseObject(resourceClient.DB, req.CourseId)
	if course == nil {
		log.Errorf("Query course id %s fail: %s", req.CourseId, err.Error())
		util.RespondWithError(c, http.StatusInternalServerError,
			"Query course id %s fail: %s", req.CourseId, err.Error())
		return
	}

	// 	Step 1-2: find dataset required by course
	datasets := getRequiredDataset(resourceClient.DB, req.CourseId)
	if datasets == nil {
		log.Errorf("Query course id %s required dataset fail: %s", req.CourseId, err.Error())
		util.RespondWithError(c, http.StatusInternalServerError,
			"Query course id %s required dataset fail: %s", req.CourseId, err.Error())
		return
	}

	// Step 2: create kubernetes resources
	// 	Step 2-1: create deployment
	deployment, err := createDeployment(resourceClient.K8sClient, course, datasets)

	if err != nil {
		errStrt := fmt.Sprintf("create deployment for course {id = %s} fail: %s", course.ID, err.Error())
		log.Errorf(errStrt)
		util.RespondWithError(c, http.StatusInternalServerError, errStrt)
		return
	}

	// 	Step 2-2: create service
	svc, err := createService(resourceClient.K8sClient, deployment.Name)
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

	c.JSON(http.StatusOK, model.LaunchCourseResponse{
		Error: false,
		Job: model.JobStatus{
			JobId:  deployment.Name,
			Ready:  false,
			Status: "Created",
		},
	})

}
