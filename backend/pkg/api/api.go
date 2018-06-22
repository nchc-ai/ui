package api

import (
	"strconv"
	"fmt"
	"strings"
	"log"
	"net/http"

	"k8s.io/client-go/kubernetes"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/validate"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"github.com/jinzhu/gorm"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

type ResourceClient struct {
	K8sClient *kubernetes.Clientset
	DB        *gorm.DB
}

type APIServer struct {
	config         *viper.Viper
	router         *gin.Engine
	verifier       validate.Validate
	resourceClient *ResourceClient
}

func NewAPIServer(config *viper.Viper) *APIServer {
	kclient, err := NewKClients(config)
	if err != nil {
		log.Fatalf("Create kubernetes client fail: %s", err.Error())
		return nil
	}

	dbclient, err := NewDBClient(config)
	if err != nil {
		log.Fatalf("Create database client fail: %s", err.Error())
		return nil
	}

	var verifier validate.Validate
	switch oauthProvider := config.GetString("api-server.validate.type"); oauthProvider {
	case "go-oauth":
		verifier = validate.NewGoAuthValidate(config)
	case "github":
		verifier = validate.NewGithubValidate(config)
	default:
		log.Println(fmt.Sprintf("%s is a not supported provider type, use dummy validater", oauthProvider))
		verifier = validate.NewDummyValidate(config)
	}

	return &APIServer{
		config: config,
		resourceClient: &ResourceClient{
			DB:        dbclient,
			K8sClient: kclient,
		},
		router:   gin.Default(),
		verifier: verifier,
	}
}

func (server *APIServer) RunServer() error {

	defer server.resourceClient.DB.Close()

	// add middleware
	server.router.Use(server.CORSHeaderMiddleware())

	// add route
	server.resourceClient.AddRoute(server.router, server.AuthMiddleware())

	err := server.router.Run(":" + strconv.Itoa(server.config.GetInt("api-server.port")))
	if err != nil {
		return err
	}
	return nil
}

func respondWithError(code int, message string, c *gin.Context) {
	resp := model.GenericResponse{
		Error:   true,
		Message: message,
	}
	c.JSON(code, resp)
	c.Abort()
}

func (server *APIServer) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		//token := c.Request.FormValue("token")

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			respondWithError(http.StatusUnauthorized, "Authorization header is missing", c)
			return
		}

		bearerToken := strings.Split(authHeader, " ")

		if len(bearerToken) != 2 || bearerToken[0] != "Bearer" {
			respondWithError(http.StatusUnauthorized, "Authorization header is not Bearer Token format or token is missing", c)
			return
		}

		// todo: do we support different provider at the same time ?
		// if so, we need verify token with all supported provider
		validated, err := server.verifier.Validate(bearerToken[1])
		if err != nil {
			respondWithError(http.StatusInternalServerError, fmt.Sprintf("verify token process fail: %s", err.Error()), c)
			return
		}

		if !validated {
			respondWithError(http.StatusForbidden, "Invalid API token", c)
			return
		}

		// todo: add provider name in header
		//c.Header("Provider", "provider-name")

		// todo: verify if token is expire

		c.Next()
	}
}

func (server *APIServer) CORSHeaderMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Next()
	}
}

func (resourceClient *ResourceClient) handleOption(c *gin.Context) {
	//	setup headers
	c.Header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Credentials")
	c.Status(http.StatusOK)
}

func (resourceClient *ResourceClient) AddRoute(router *gin.Engine, authMiddleware gin.HandlerFunc) {

	// health check api
	clusterGroup := router.Group("/v1").Group("/health")
	{
		clusterGroup.GET("/kubernetes", resourceClient.checkK8s)
		clusterGroup.OPTIONS("/kubernetes", resourceClient.handleOption)
		clusterGroup.POST("/database", resourceClient.checkDatabase)
		clusterGroup.OPTIONS("/database", resourceClient.handleOption)
		clusterGroup.OPTIONS("/kubernetesAuth", resourceClient.handleOption)
		clusterGroup.OPTIONS("/databaseAuth", resourceClient.handleOption)
	}

	// health check require token
	authGroup := router.Group("/v1").Group("/health").Use(authMiddleware)
	{
		authGroup.GET("/kubernetesAuth", resourceClient.checkK8s)
		authGroup.POST("/databaseAuth", resourceClient.checkDatabase)
	}

	// list advance and basic course, do not required token
	bb := router.Group("/v1").Group("/course")
	{
		bb.GET("/level/:level", resourceClient.ListCourse)
		bb.OPTIONS("/level/:level", resourceClient.handleOption)
		bb.OPTIONS("/create", resourceClient.handleOption)
		bb.OPTIONS("/list", resourceClient.handleOption)
	}

	// list/add course under specific user, token is required
	aa := router.Group("/v1").Group("/course").Use(authMiddleware)
	{
		aa.POST("/create", resourceClient.AddCourse)
		aa.POST("/list", resourceClient.ListCourse)
	}

}
