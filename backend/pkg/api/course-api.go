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
	"strings"
)

// @Summary List someone's all courses information
// @Description List someone's all courses information
// @Tags Course
// @Accept  json
// @Produce  json
// @Param list_user body docs.OauthUser true "search user course"
// @Success 200 {object} docs.ListCourseResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 401 {object} docs.GenericErrorResponse
// @Failure 403 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Security ApiKeyAuth
// @Router /v1/course/list [post]
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

// @Summary List basic or advance courses information
// @Description List basic or advance courses information
// @Tags Course
// @Accept  json
// @Produce  json
// @Param level path string true "basic or advance"
// @Success 200 {object} docs.ListCourseResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Router /v1/course/level/{level} [get]
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

// @Summary List all course information
// @Description get all course information
// @Tags Course
// @Accept  json
// @Produce  json
// @Success 200 {object} docs.ListCourseResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Router /v1/course/list [get]
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

// @Summary Search course name
// @Description Search course name
// @Tags Course
// @Accept  json
// @Produce  json
// @Param search body docs.Search true "search keyword"
// @Success 200 {object} docs.ListCourseResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Router /v1/course/search [post]
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

// @Summary Add new course information
// @Description Add new course information into database
// @Tags Course
// @Accept  json
// @Produce  json
// @Param course body docs.AddCourse true "course information"
// @Success 200 {object} docs.GenericOKResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 401 {object} docs.GenericErrorResponse
// @Failure 403 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Security ApiKeyAuth
// @Router /v1/course/create [post]
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

// @Summary Delete course information
// @Description All associated job, Deployment and svc in kubernetes are also deleted.
// @Tags Course
// @Accept  json
// @Produce  json
// @Param id path string true "course uuid, eg: 131ba8a9-b60b-44f9-83b5-46590f756f41"
// @Success 200 {object} docs.GenericOKResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 401 {object} docs.GenericErrorResponse
// @Failure 403 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Security ApiKeyAuth
// @Router /v1/course/delete/{id} [delete]
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

// @Summary Get one courses information by course id
// @Description Get one courses information by course id
// @Tags Course
// @Accept  json
// @Produce  json
// @Param id path string true "course uuid, eg: 131ba8a9-b60b-44f9-83b5-46590f756f41"
// @Success 200 {object} docs.GetCourseResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 401 {object} docs.GenericErrorResponse
// @Failure 403 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Security ApiKeyAuth
// @Router /v1/course/get/{id} [get]
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
		// https://gitlab.com/nchc-ai/AI-Eduational-Platform/issues/18
		// should remove "dataset-" prefix in dataset name (i.e. PVC name)
		courseDataset = append(courseDataset, strings.SplitN(s.DatasetName, "-", 2)[1])
	}

	result.Datasets = courseDataset

	c.JSON(http.StatusOK, model.GetCourseResponse{
		Error:  false,
		Course: result,
	})
}

// todo: do we allow user to modify image/gpu, if so, we need to restart job deployment
// @Summary Update course information
// @Description Update course information
// @Tags Course
// @Accept  json
// @Produce  json
// @Param course body docs.UpdateCourse true "new course information"
// @Success 200 {object} docs.GenericOKResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 401 {object} docs.GenericErrorResponse
// @Failure 403 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Security ApiKeyAuth
// @Router /v1/course/update [put]
func (resourceClient *ResourceClient) UpdateCourse(c *gin.Context) {
	var req model.Course

	err := c.BindJSON(&req)
	if err != nil {
		log.Errorf("Failed to parse spec request request: %s", err.Error())
		util.RespondWithError(c, http.StatusBadRequest, "Failed to parse spec request request: %s", err.Error())
		return
	}

	if req.ID == "" {
		log.Errorf("Course id is empty")
		util.RespondWithError(c, http.StatusBadRequest, "Course id is empty")
		return
	}

	findCourse := model.Course{
		Model: model.Model{
			ID: req.ID,
		},
	}

	if err = resourceClient.DB.First(&findCourse).Error; err != nil {
		errStr := fmt.Sprintf("find course {%s} fail: %s", req.ID, err.Error())
		log.Errorf(errStr)
		util.RespondWithError(c, http.StatusInternalServerError, errStr)
		return
	}

	// update Course DB
	if err := resourceClient.DB.Model(&findCourse).Updates(
		model.Course{
			Name:         req.Name,
			Introduction: req.Introduction,
			Level:        req.Level,
		}).Error; err != nil {
		errStr := fmt.Sprintf("update course {%s} information fail: %s", req.ID, err.Error())
		log.Errorf(errStr)
		util.RespondWithError(c, http.StatusInternalServerError, errStr)
		return
	}

	// update dataset required by course in DB

	// Step 1: delete dataset used by course
	if err = resourceClient.DB.Where("course_id = ?", req.ID).Delete(model.Dataset{}).Error; err != nil {
		errStr := fmt.Sprintf("Failed to delete course {%s} dataset information in DB: %s", req.ID, err.Error())
		log.Errorf(errStr)
		util.RespondWithError(c, http.StatusInternalServerError, errStr)
	}

	// Step 2: careate new datasets
	for _, data := range req.Datasets {
		newDataset := model.Dataset{
			CourseID:    req.ID,
			DatasetName: data,
		}
		if err = resourceClient.DB.Create(&newDataset).Error; err != nil {
			log.Errorf("Failed to create course-dataset information in DB: %s", err.Error())
			util.RespondWithError(c, http.StatusInternalServerError, "Failed to create course-dataset information in DB: %s", err.Error())
			return
		}
	}

	util.RespondWithOk(c, "Course {%s} update successfully", req.ID)
}
