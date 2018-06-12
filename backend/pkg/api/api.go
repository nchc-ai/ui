package api

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/kubernetes"
	"strconv"
	"log"

	_ "github.com/jinzhu/gorm/dialects/mysql"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/db"
)

type APIServer struct {
	K8sClient *kubernetes.KClients
	config    *viper.Viper
	router    *gin.Engine
	dbClient  *db.DBClient
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

	return &APIServer{
		config:    config,
		K8sClient: kclient,
		dbClient:  dbclient,
		router:    gin.Default(),
	}
}

func (server *APIServer) RunServer() error {

	defer server.dbClient.DB.Close()

	server.K8sClient.AddRoute(server.router)
	server.dbClient.AddRoute(server.router)

	err := server.router.Run(":" + strconv.Itoa(server.config.GetInt("api-server.port")))
	if err != nil {
		return err
	}
	return nil
}
