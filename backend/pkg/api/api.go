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
	apiv1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	"github.com/spf13/cast"
)

type KClient struct {
	KClientSet           *kubernetes.Clientset
	defaultResourceLimit apiv1.ResourceList
	exposePort           map[string]int32
	namespace            string
}

type ResourceClient struct {
	config *viper.Viper
	//K8sClient *kubernetes.Clientset
	K8sClient *KClient
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
			config:    config,
		},
		router:        gin.Default(),
		providerProxy: providerProxy,
	}
}

func NewKClients(config *viper.Viper) (*KClient, error) {

	kConfig, err := util.GetConfig(
		config.GetBool("api-server.isOutsideCluster"),
		config.GetString("kubernetes.kubeconfig"))

	if err != nil {
		log.Fatalf("create kubenetes config fail: %s", err.Error())
		return nil, err
	}

	clientset, err := kubernetes.NewForConfig(kConfig)
	if err != nil {
		log.Fatalf("create kubenetes client set fail: %s", err.Error())
		return nil, err
	}

	exposePort := make(map[string]int32)
	for k, v := range config.GetStringMap("kubernetes.expose_port") {
		exposePort[k] = cast.ToInt32(v)
	}

	defaultResourceLimit := apiv1.ResourceList{
		apiv1.ResourceMemory: resource.MustParse(config.GetString("kubernetes.resourceLimit.memory")),
		apiv1.ResourceCPU:    resource.MustParse(config.GetString("kubernetes.resourceLimit.cpu")),
	}

	c := &KClient{
		KClientSet:           clientset,
		defaultResourceLimit: defaultResourceLimit,
		exposePort:           exposePort,
		namespace:            config.GetString("kubernetes.namespace"),
	}
	return c, nil
}

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
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
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
		course.GET("/level/:level", resourceClient.ListLevelCourse)
		course.GET("/list", resourceClient.ListAllCourse)
		course.POST("/search", resourceClient.SearchCourse)
		course.OPTIONS("/level/:level", resourceClient.handleOption)
		course.OPTIONS("/create", resourceClient.handleOption)
		course.OPTIONS("/list", resourceClient.handleOption)
		course.OPTIONS("/delete/:id", resourceClient.handleOption)
		course.OPTIONS("/get/:id", resourceClient.handleOption)
		course.OPTIONS("/search", resourceClient.handleOption)
		course.OPTIONS("/update", resourceClient.handleOption)
	}

	// list/add course under specific user, token is required
	courseAuth := router.Group("/v1").Group("/course").Use(server.AuthMiddleware())
	{
		courseAuth.POST("/create", resourceClient.AddCourse)
		courseAuth.POST("/list", resourceClient.ListUserCourse)
		courseAuth.DELETE("/delete/:id", resourceClient.DeleteCourse)
		courseAuth.GET("/get/:id", resourceClient.GetCourse)
		courseAuth.PUT("/update", resourceClient.UpdateCourse)
	}

	job := router.Group("/v1").Group("/job")
	{
		job.OPTIONS("/list", resourceClient.handleOption)
		job.OPTIONS("/delete/:id", resourceClient.handleOption)
		job.OPTIONS("/launch", resourceClient.handleOption)
	}

	jobAuth := router.Group("/v1").Group("/job").Use(server.AuthMiddleware())
	{
		jobAuth.POST("/list", resourceClient.ListJob)
		jobAuth.DELETE("/delete/:id", resourceClient.DeleteJob)
		jobAuth.POST("/launch", resourceClient.LaunchJob)
	}

	//proxy for communicate with provider
	proxy := router.Group("/v1").Group("/proxy")
	{
		proxy.POST("/token", server.GetToken)
		proxy.OPTIONS("/token", resourceClient.handleOption)
		proxy.POST("/refresh", server.RefreshToken)
		proxy.OPTIONS("/refresh", resourceClient.handleOption)
		proxy.POST("/introspection", server.Introspection)
		proxy.OPTIONS("/introspection", resourceClient.handleOption)
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

func (server *APIServer) Resume() {

	job := model.Job{
		Status: JoBStatueReady,
	}
	resultJobs := []model.Job{}
	if err := server.resourceClient.DB.Not(&job).Find(&resultJobs).Error; err != nil {
		log.Warningf("find Job in Pending state fail: %s", err.Error())
		return
	}

	for _, j := range resultJobs {
		log.Infof("start check deployment {%s} and service {%s}", j.ID, j.Service)
		go server.resourceClient.checkJobStatus(j.ID, j.Service)
	}

}
