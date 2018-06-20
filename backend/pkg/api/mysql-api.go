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
	db.AutoMigrate(course)
	db.AutoMigrate(job)
	db.AutoMigrate(dateset)

	db.Model(job).AddForeignKey("course_id", "courses(id)", "RESTRICT", "RESTRICT")
	db.Model(dateset).AddForeignKey("course_id", "courses(id)", "RESTRICT", "RESTRICT")

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
