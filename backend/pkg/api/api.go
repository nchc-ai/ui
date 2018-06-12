package api

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/kubernetes"
	"strconv"
	"log"
)

type APIServer struct {
	K8sClient *kubernetes.KClients
	config    *viper.Viper
	router    *gin.Engine
}

func NewAPIServer(config *viper.Viper) *APIServer {

	// todo: initialize db client

	kclient, err := kubernetes.NewKClients(config)
	if err != nil {
		log.Fatalf("Create kubernetes client fail: %s", err.Error())
		return nil
	}

	return &APIServer{
		config:    config,
		K8sClient: kclient,
		router:    gin.Default(),
	}
}

func (server *APIServer) RunServer() error {
	// todo: add database route
	server.K8sClient.AddRoute(server.router)
	err := server.router.Run(":" + strconv.Itoa(server.config.GetInt("api-server.port")))
	if err != nil {
		return err
	}
	return nil
}
