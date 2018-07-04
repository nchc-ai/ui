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

func (resourceClient *ResourceClient) ListUserCourse(c *gin.Context) {
	provider, exist := c.Get("Provider")
	if exist == false {
		provider = ""
	}

	req := model.Course{}
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

	course := model.Course{
		OauthUser: model.OauthUser{
			User:     req.User,
			Provider: provider.(string),
		},
	}

	resp, err := queryCourse(resourceClient.DB, course)

	if err != nil {
		errStr := fmt.Sprintf("query user {%s} course fail: %s", req.User, err.Error())
		log.Errorf(errStr)
		util.RespondWithError(c, http.StatusInternalServerError, errStr)
		return
	}

	c.JSON(http.StatusOK, model.ListCourseResponse{
		Error:   false,
		Courses: resp,
	})

}

func (resourceClient *ResourceClient) ListLevelCourse(c *gin.Context) {
	level := c.Param("level")

	if level == "" {
		log.Errorf("empty level string")
		util.RespondWithError(c, http.StatusBadRequest, "empty level string")
		return
	}

	course := model.Course{
		Level: level,
	}

	results, err := queryCourse(resourceClient.DB, course)

	if err != nil {
		errStr := fmt.Sprintf("query %s level course fail: %s", level, err.Error())
		log.Errorf(errStr)
		util.RespondWithError(c, http.StatusInternalServerError, errStr)
		return
	}

	c.JSON(http.StatusOK, model.ListCourseResponse{
		Error:   false,
		Courses: results,
	})

}

func (resourceClient *ResourceClient) ListAllCourse(c *gin.Context) {
	course := model.Course{}

	results, err := queryCourse(resourceClient.DB, course)

	if err != nil {
		errStr := fmt.Sprintf("query all course fail: %s", err.Error())
		log.Errorf(errStr)
		util.RespondWithError(c, http.StatusInternalServerError, errStr)
		return
	}

	c.JSON(http.StatusOK, model.ListCourseResponse{
		Error:   false,
		Courses: results,
	})
}

func (resourceClient *ResourceClient) SearchCourse(c *gin.Context) {

	req := model.Search{}
	err := c.BindJSON(&req)
	if err != nil {
		log.Errorf("Failed to parse spec request request: %s", err.Error())
		util.RespondWithError(c, http.StatusBadRequest, "Failed to parse spec request request: %s", err.Error())
		return
	}

	if req.Query == "" {
		log.Errorf("Empty query condition")
		util.RespondWithError(c, http.StatusBadRequest, "Empty query condition")
		return
	}
	results, err := queryCourse(resourceClient.DB, "name LIKE ?", "%"+req.Query+"%")

	if err != nil {
		errStr := fmt.Sprintf("search course on condition Name like % %s % fail: %s", req.Query, err.Error())
		log.Errorf(errStr)
		util.RespondWithError(c, http.StatusInternalServerError, errStr)
		return
	}

	c.JSON(http.StatusOK, model.ListCourseResponse{
		Error:   false,
		Courses: results,
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
	jobs := []model.Job{}

	// Step 1: Find all associated Deployment/Service
	if err := resourceClient.DB.Model(&course).Related(&jobs).Error; err != nil {
		util.RespondWithError(c, http.StatusInternalServerError,
			"Failed to find jobs belong to course {%s} information : %s", courseId, err.Error())
		return
	}

	// Step 2: Stop deployment and service in kubernetes
	// 	 Step 2-1: delete jobs in DB.
	for _, j := range jobs {
		if errStr, err := resourceClient.deleteJobDeploymentAndSvc(j.ID); err != nil {
			util.RespondWithError(c, http.StatusInternalServerError, errStr)
			return
		}
	}

	// Step 3: Delete course in DB.
	// Step 4: delete required dataset in DB. (With foreign key, this should be done automatically)
	err := resourceClient.DB.Unscoped().Delete(&course).Error
	if err != nil {
		util.RespondWithError(c, http.StatusInternalServerError,
			"Failed to delete course {%s} information : %s", courseId, err.Error())
		return
	}

	util.RespondWithOk(c, "Course %s is deleted successfully, associated jobs are also deleted", courseId)
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

func (resourceClient *ResourceClient) GetCourse(c *gin.Context) {
	id := c.Param("id")

	if id == "" {
		log.Errorf("Empty course id")
		util.RespondWithError(c, http.StatusBadRequest, "Empty course id")
		return
	}

	course := model.Course{
		Model: model.Model{
			ID: id,
		},
	}

	result := model.Course{}
	if err := resourceClient.DB.Where(&course).First(&result).Error; err != nil {
		log.Errorf("Query courses {%s} fail: %s", id, err.Error())
		util.RespondWithError(c, http.StatusInternalServerError, "Query courses {%s} fail: %s", id, err.Error())
		return
	}

	dataset := model.Dataset{
		CourseID: id,
	}
	datasetResult := []model.Dataset{}
	if err := resourceClient.DB.Where(&dataset).Find(&datasetResult).Error; err != nil {
		log.Errorf("Query course {%s} datasets fail: %s", id, err.Error())
		util.RespondWithError(c, http.StatusInternalServerError, "Query course {%s} datasets fail: %s", id, err.Error())
		return
	}
	courseDataset := []string{}
	for _, s := range datasetResult {
		courseDataset = append(courseDataset, s.DatasetName)
	}

	result.Datasets = courseDataset

	c.JSON(http.StatusOK, model.GetCourseResponse{
		Error:  false,
		Course: result,
	})

}
