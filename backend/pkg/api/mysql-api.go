package api

import (
	"log"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/jinzhu/gorm"
	"github.com/spf13/viper"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"github.com/google/uuid"
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
		log.Fatalf("create database client fail: " + err.Error())
		return nil, err
	}

	// create tables
	course := &model.Course{}
	job := &model.Job{}
	dateset := &model.Dataset{}
	student := &model.StudentTake{}
	proxy := &model.Proxy{}

	db.AutoMigrate(course)
	db.AutoMigrate(job)
	db.AutoMigrate(dateset)
	db.AutoMigrate(student)
	db.AutoMigrate(proxy)

	// add foreign key
	db.Model(job).AddForeignKey("course_id", "courses(id)", "RESTRICT", "RESTRICT")
	db.Model(dateset).AddForeignKey("course_id", "courses(id)", "RESTRICT", "RESTRICT")
	db.Model(student).AddForeignKey("course_id", "courses(id)", "RESTRICT", "RESTRICT")
	db.Model(proxy).AddForeignKey("job_id", "jobs(id)", "RESTRICT", "RESTRICT")

	return db, nil
}

func (resourceClient *ResourceClient) checkDatabase(c *gin.Context) {
	var req model.GenericRequest
	err := c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": true,
			"cause": "Failed to parse spec request request: " + err.Error(),
		})
		return
	}
	msg := req.Message

	tNameList := []string{}

	rows, err := resourceClient.DB.Raw("show tables").Rows()

	if err != nil {
		log.Fatalf("Show all table name fail: %s", err.Error())

		c.JSON(http.StatusInternalServerError, model.GenericResponse{
			Error:   true,
			Message: "Query all table name fail: " + err.Error(),
		})
		return
	}

	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			log.Fatal("Scan table name fail: " + err.Error())
			c.JSON(http.StatusInternalServerError, model.GenericResponse{
				Error:   true,
				Message: "Scan table name fail: " + err.Error(),
			})
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
	provider := c.GetHeader("Provider")
	user := c.Param("user")
	level := c.Param("level")

	course := model.Course{
		OauthUser: model.OauthUser{
			User:     user,
			Provider: provider,
		},
		Level: level,
	}

	results := []model.Course{}
	err := resourceClient.DB.Where(&course).Find(&results).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": true,
			"cause": "Query courses table fail: " + err.Error(),
		})
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
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": true,
				"cause": "Query datasets table fail: " + err.Error(),
			})
			return
		}

		courseDataset := []string{}

		for _, s := range datasetResult {
			courseDataset = append(courseDataset, s.DatasetName)
		}

		resp = append(resp, model.Course{
			Model: model.Model{
				ID: result.ID,
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
		c.JSON(http.StatusBadRequest, gin.H{
			"error": true,
			"cause": "Failed to parse spec request request: " + err.Error(),
		})
		return
	}

	// add course information in DB
	courseID := uuid.New().String()

	provider := c.GetHeader("Provider")
	user := c.Param("user")

	newCourse := model.Course{
		Model: model.Model{
			ID: courseID,
		},
		OauthUser: model.OauthUser{
			User:     user,
			Provider: provider,
		},
		Introduction: req.Introduction,
		Name:         req.Name,
		Image:        req.Image,
		Level:        req.Level,
		Gpu:          req.Gpu,
	}

	err = resourceClient.DB.Create(&newCourse).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": true,
			"cause": "Failed to create course information: " + err.Error(),
		})
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
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": true,
				"cause": "Failed to create course-dataset information in DB: " + err.Error(),
			})
			return
		}
	}

	c.JSON(http.StatusOK, model.GenericResponse{
		Error:   false,
		Message: fmt.Sprintf("Course %s created successfully", req.Name),
	}, )

}
