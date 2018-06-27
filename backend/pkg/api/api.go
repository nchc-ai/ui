package api

import (
	"strconv"
	"fmt"
	"strings"
	"net/http"
	"encoding/json"

	"k8s.io/client-go/kubernetes"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/provider"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"github.com/jinzhu/gorm"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	log "github.com/golang/glog"
)

type ResourceClient struct {
	K8sClient *kubernetes.Clientset
	DB        *gorm.DB
}

type APIServer struct {
	config         *viper.Viper
	router         *gin.Engine
	providerProxy  provider.Provider
	resourceClient *ResourceClient
}

func NewAPIServer(config *viper.Viper) *APIServer {
	kclient, err := NewKClients(config)
	if err != nil {
		log.Fatalf("Create kubernetes client fail, Stop...: %s", err.Error())
		return nil
	}
	log.Info("Create Kubernetes Client")

	dbclient, err := NewDBClient(config)
	if err != nil {
		log.Fatalf("Create database client fail, Stop...: %s", err.Error())
		return nil
	}
	log.Info("Create Database Client")

	// convert each provider config json to ProviderConfig struct
	// we need two phase conversion, map[string]interface{} -> json -> struct
	// https://www.cnblogs.com/liang1101/p/6741262.html
	log.Info("Create Oauth Provider Proxy")
	providerConfigstr := config.GetStringMapString("api-server.provider")
	var vconf model.ProviderConfig

	// map[string]string -> json
	jsonStr, err := json.Marshal(providerConfigstr)
	if err != nil {
		log.Fatalf(fmt.Sprintf(":%s", err.Error()))
		return nil
	}

	// json -> struct
	err = json.Unmarshal([]byte(jsonStr), &vconf)
	if err != nil {
		log.Fatalf(fmt.Sprintf(":%s", err.Error()))
		return nil
	}

	var providerProxy provider.Provider
	switch oauthProvider := vconf.Type; oauthProvider {
	case "go-oauth":
		providerProxy = provider.NewGoAuthProvider(vconf)
	default:
		log.Warning(fmt.Sprintf("%s is a not supported provider type", oauthProvider))
	}

	return &APIServer{
		config: config,
		resourceClient: &ResourceClient{
			DB:        dbclient,
			K8sClient: kclient,
		},
		router:        gin.Default(),
		providerProxy: providerProxy,
	}
}

func (server *APIServer) RunServer() error {

	defer server.resourceClient.DB.Close()

	// add middleware
	server.router.Use(server.CORSHeaderMiddleware())

	// add route
	server.AddRoute(server.router, server.resourceClient)

	err := server.router.Run(":" + strconv.Itoa(server.config.GetInt("api-server.port")))
	if err != nil {
		return err
	}
	return nil
}

func (server *APIServer) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			log.Error("Authorization header is missing")
			util.RespondWithError(c, http.StatusUnauthorized, "Authorization header is missing")
			return
		}

		bearerToken := strings.Split(authHeader, " ")

		if len(bearerToken) != 2 || bearerToken[0] != "Bearer" {
			log.Errorf("Authorization header is not Bearer Token format or token is missing: %s", authHeader)
			util.RespondWithError(c, http.StatusUnauthorized, "Authorization header is not Bearer Token format or token is missing")
			return
		}

		var validated bool
		var err error

		token := bearerToken[1]
		validated, err = server.providerProxy.Validate(token)

		if err != nil && err.Error() == "Access token expired" {
			log.Error("Access token expired")
			util.RespondWithError(c, http.StatusForbidden, "Access token expired")
			return
		}

		if err != nil {
			log.Errorf("verify token fail: %s", err.Error())
			util.RespondWithError(c, http.StatusInternalServerError, "verify token fail: %s", err.Error())
			return
		}

		if !validated {
			util.RespondWithError(c, http.StatusForbidden, "Invalid API token")
			return
		}

		c.Set("Provider", server.providerProxy.Name())
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
	c.Header("Access-Control-Allow-Headers", "Authorization, Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Credentials")
	c.Status(http.StatusOK)
}

func (server *APIServer) AddRoute(router *gin.Engine, resourceClient *ResourceClient) {

	// health check api
	health := router.Group("/v1").Group("/health")
	{
		health.GET("/kubernetes", resourceClient.checkK8s)
		health.OPTIONS("/kubernetes", resourceClient.handleOption)
		health.POST("/database", resourceClient.checkDatabase)
		health.OPTIONS("/database", resourceClient.handleOption)
		health.OPTIONS("/kubernetesAuth", resourceClient.handleOption)
		health.OPTIONS("/databaseAuth", resourceClient.handleOption)
	}

	// health check require token
	healthAuth := router.Group("/v1").Group("/health").Use(server.AuthMiddleware())
	{
		healthAuth.GET("/kubernetesAuth", resourceClient.checkK8s)
		healthAuth.POST("/databaseAuth", resourceClient.checkDatabase)
	}

	// list advance and basic course, do not required token
	course := router.Group("/v1").Group("/course")
	{
		course.GET("/level/:level", resourceClient.ListCourse)
		course.OPTIONS("/level/:level", resourceClient.handleOption)
		course.OPTIONS("/create", resourceClient.handleOption)
		course.OPTIONS("/list", resourceClient.handleOption)
		course.OPTIONS("/delete/:id", resourceClient.handleOption)
		course.OPTIONS("/launch", resourceClient.handleOption)
	}

	// list/add course under specific user, token is required
	courseAuth := router.Group("/v1").Group("/course").Use(server.AuthMiddleware())
	{
		courseAuth.POST("/create", resourceClient.AddCourse)
		courseAuth.POST("/list", resourceClient.ListCourse)
		courseAuth.DELETE("/delete/:id", resourceClient.DeleteCourse)
		courseAuth.POST("/launch", resourceClient.LaunchCourse)
	}

	job := router.Group("/v1").Group("/job")
	{
		job.OPTIONS("/ready/:jobid", resourceClient.handleOption)
	}

	jobAuth := router.Group("/v1").Group("/job")
	{
		jobAuth.GET("/ready/:jobid", resourceClient.IsJobReady).Use(server.AuthMiddleware())
	}

	//proxy for communicate with provider
	proxy := router.Group("/v1").Group("/proxy")
	{
		proxy.POST("/token", server.GetToken)
		proxy.OPTIONS("/token", resourceClient.handleOption)
		proxy.POST("/refresh", server.RefreshToken)
		proxy.OPTIONS("/refresh", resourceClient.handleOption)
	}

	dataset := router.Group("/v1").Group("/datasets")
	{
		dataset.OPTIONS("/", resourceClient.handleOption)
	}

	datasetAuth := router.Group("/v1").Group("/datasets").Use(server.AuthMiddleware())
	{
		datasetAuth.GET("/", resourceClient.ListPVC)
	}

	image := router.Group("/v1").Group("/images")
	{
		image.OPTIONS("/", resourceClient.handleOption)
	}

	imageAuth := router.Group("/v1").Group("/images").Use(server.AuthMiddleware())
	{
		imageAuth.GET("/", resourceClient.ListImage)
	}
}

func (server *APIServer) GetToken(c *gin.Context) {

	var req model.TokenReq
	err := c.BindJSON(&req)
	if err != nil {
		log.Errorf("Failed to parse spec request request: %s", err.Error())
		util.RespondWithError(c, http.StatusBadRequest, "Failed to parse spec request request: %s", err.Error())
		return
	}

	token, err := server.providerProxy.GetToken(req.Code)

	if err != nil {
		log.Errorf("Exchange Token fail: %s", err.Error())
		util.RespondWithError(c, http.StatusInternalServerError, "Exchange Token fail: %s", err.Error())
		return
	}

	c.JSON(http.StatusOK,
		model.TokenResp{
			Token:        token.AccessToken,
			RefreshToken: token.RefreshToken,
		},
	)
}

func (server *APIServer) RefreshToken(c *gin.Context) {
	var req model.RefreshTokenReq
	err := c.BindJSON(&req)
	if err != nil {
		log.Errorf("Failed to parse spec request request: %s", err.Error())
		util.RespondWithError(c, http.StatusBadRequest, "Failed to parse spec request request: %s", err.Error())
		return
	}

	newToken, err := server.providerProxy.RefreshToken(req.RefreshToken)

	if err != nil {
		log.Errorf("Refresh Token fail: %s", err.Error())
		util.RespondWithError(c, http.StatusInternalServerError, "Refresh Token fail: %s", err.Error())
		return
	}

	c.JSON(http.StatusOK,
		model.TokenResp{
			Token:        newToken.AccessToken,
			RefreshToken: newToken.RefreshToken,
		},
	)
}
