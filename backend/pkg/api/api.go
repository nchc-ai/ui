package api

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/kubernetes"
	"strconv"
	"log"

	_ "github.com/jinzhu/gorm/dialects/mysql"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/db"
	"fmt"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/validate"
)

type APIServer struct {
	config    *viper.Viper
	router    *gin.Engine
	k8sClient *kubernetes.KClients
	dbClient  *db.DBClient
	verifier  validate.Validate
}

func NewAPIServer(config *viper.Viper) *APIServer {
	kclient, err := kubernetes.NewKClients(config)
	if err != nil {
		log.Fatalf("Create kubernetes client fail: %s", err.Error())
		return nil
	}

	dbclient, err := db.NewDBClient(config)
	if err != nil {
		log.Fatalf("Create database client fail: %s", err.Error())
		return nil
	}

	var verifier validate.Validate
	verifier = validate.NewGithubValidate(config)

	//var i validate.Validate =

	return &APIServer{
		config:    config,
		k8sClient: kclient,
		dbClient:  dbclient,
		router:    gin.Default(),
		verifier:  verifier,
	}
}

func (server *APIServer) RunServer() error {

	defer server.dbClient.DB.Close()

	//server.router.Use(server.AuthMiddleware())

	server.k8sClient.AddRoute(server.router)
	server.dbClient.AddRoute(server.router)

	err := server.router.Run(":" + strconv.Itoa(server.config.GetInt("api-server.port")))
	if err != nil {
		return err
	}
	return nil
}

func (server *APIServer) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("check auth")
		token := "aaa"
		server.verifier.Validate(token)

		c.Next()
	}
}
