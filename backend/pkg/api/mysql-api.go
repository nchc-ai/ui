package api

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/jinzhu/gorm"
	"github.com/spf13/viper"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"github.com/google/uuid"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	log "github.com/golang/glog"
)

func NewDBClient(config *viper.Viper) (*gorm.DB, error) {

	dbArgs := fmt.Sprintf(
		"%s:%s@tcp(%s:%d)/%s?charset=utf8&parseTime=True",
		config.GetString("database.username"),
		config.GetString("database.password"),
		config.GetString("database.host"),
		config.GetInt("database.port"),
		config.GetString("database.database"),
	)

	db, err := gorm.Open("mysql", dbArgs)

	if err != nil {
		log.Fatalf("create database client fail: %s", err.Error())
		return nil, err
	}

	// create tables
	course := &model.Course{}
	job := &model.Job{}
	dateset := &model.Dataset{}

	db.AutoMigrate(course)
	db.AutoMigrate(job)
	db.AutoMigrate(dateset)

	// add foreign key
	db.Model(job).AddForeignKey("course_id", "courses(id)", "CASCADE", "RESTRICT")
	db.Model(dateset).AddForeignKey("course_id", "courses(id)", "CASCADE", "RESTRICT")

	return db, nil
}

func (resourceClient *ResourceClient) checkDatabase(c *gin.Context) {
	var req model.GenericRequest
	err := c.BindJSON(&req)
	if err != nil {
		log.Errorf("Failed to parse spec request request: %s", err.Error())
		util.RespondWithError(c, http.StatusBadRequest, "Failed to parse spec request request: %s", err.Error())
		return
	}
	msg := req.Message

	tNameList := []string{}

	rows, err := resourceClient.DB.Raw("show tables").Rows()

	if err != nil {
		log.Errorf("Show all table name fail: %s", err.Error())
		util.RespondWithError(c, http.StatusInternalServerError, "Query all table name fail: %s", err.Error())
		return
	}

	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			log.Errorf("Scan table name fail: %s", err.Error())
			util.RespondWithError(c, http.StatusInternalServerError, "Scan table name fail: %s", err.Error())
			return
		}
		tNameList = append(tNameList, name)
	}

	resp := model.HealthDatabaseResponse{
		GenericResponse: model.GenericResponse{
			Error:   false,
			Message: msg,
		},
		Tables: tNameList,
	}

	c.JSON(http.StatusOK, resp)
}

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

// todo: implement real list image
func (resourceClient *ResourceClient) ListImage(c *gin.Context) {
	image := map[string]string{
		"tensorflow/tensorflow:1.5.1": "tensorflow/tensorflow:1.5.1",
		"nvidia/digits5.0":            "nvidia/digits5.0",
	}

	imageList := []model.LabelValue{}

	for k, v := range image {
		lbval := model.LabelValue{
			Label: k,
			Value: v,
		}
		imageList = append(imageList, lbval)
	}

	c.JSON(http.StatusOK, model.ImagesListResponse{
		Error:  false,
		Images: imageList,
	})
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

func findCourse(DB *gorm.DB, job model.Job) (*model.Course, error) {

	course := model.Course{
		Model: model.Model{
			ID: job.CourseID,
		},
	}
	err := DB.Where(&course).Find(&course).Error
	if err != nil {
		log.Errorf("Query courses table fail: %s", err.Error())
		return nil, err
	}

	dataset := model.Dataset{
		CourseID: job.CourseID,
	}
	datasetResult := []model.Dataset{}
	err = DB.Where(&dataset).Find(&datasetResult).Error
	if err != nil {
		log.Errorf("Query datasets table fail: %s", err.Error())
		return nil, err
	}

	courseDataset := []string{}

	for _, s := range datasetResult {
		courseDataset = append(courseDataset, s.DatasetName)
	}

	return &model.Course{
		Model: model.Model{
			ID:        course.ID,
			CreatedAt: course.CreatedAt,
		},
		Name:         course.Name,
		Introduction: course.Introduction,
		Image:        course.Image,
		Level:        course.Level,
		Gpu:          course.Gpu,
		Datasets:     courseDataset,
	}, nil
}
