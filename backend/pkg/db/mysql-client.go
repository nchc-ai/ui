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
		"%s:%s@tcp(%s:%d)/%s",
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

	return &DBClient{
		DB: db,
	}, nil
}

func (dbclient *DBClient) handleOption(c *gin.Context) {
	//	setup headers
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin")
	c.Status(http.StatusOK)
}

func (dbclient *DBClient) AddRoute(router *gin.Engine) {

	clusterGroup := router.Group("/v1").Group("/health")
	{
		clusterGroup.POST("/database", dbclient.checkDatabase)
		clusterGroup.OPTIONS("/database", dbclient.handleOption)
	}

}

func (dbclient *DBClient) checkDatabase(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")

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
