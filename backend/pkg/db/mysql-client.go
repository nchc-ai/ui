package db

import (
	"github.com/gin-gonic/gin"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/jinzhu/gorm"
	"github.com/spf13/viper"
	"log"
	"fmt"
	"net/http"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
)

type DBClient struct {
	DB *gorm.DB
}

func NewDBClient(config *viper.Viper) (*DBClient, error) {

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
	dbclient := DBClient{
		DB: db,
	}
	dbclient.migration()

	return &dbclient, nil
}

func (dbclient *DBClient) migration() {
	course := &model.Course{}
	job := &model.Job{}
	dateset := &model.Dataset{}
	dbclient.DB.AutoMigrate(course)
	dbclient.DB.AutoMigrate(job)
	dbclient.DB.AutoMigrate(dateset)

	dbclient.DB.Model(job).AddForeignKey("course_id", "courses(id)", "RESTRICT", "RESTRICT")
	dbclient.DB.Model(dateset).AddForeignKey("course_id", "courses(id)", "RESTRICT", "RESTRICT")
}

func (dbclient *DBClient) handleOption(c *gin.Context) {
	//	setup headers
	c.Header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin")
	c.Status(http.StatusOK)
}

func (dbclient *DBClient) AddRoute(router *gin.Engine, authMiddleware gin.HandlerFunc) {

	// health check
	clusterGroup := router.Group("/v1").Group("/health")
	{
		clusterGroup.POST("/database", dbclient.checkDatabase)
		clusterGroup.OPTIONS("/database", dbclient.handleOption)
	}

	// health check require token
	authGroup := router.Group("/v1").Group("/health").Use(authMiddleware)
	{
		authGroup.POST("/databaseAuth", dbclient.checkDatabase)
		authGroup.OPTIONS("/databaseAuth", dbclient.handleOption)
	}
}

func (dbclient *DBClient) checkDatabase(c *gin.Context) {
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

	rows, err := dbclient.DB.Raw("show tables").Rows()

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
