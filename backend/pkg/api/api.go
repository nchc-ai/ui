package api

import (
	"strconv"
	"fmt"
	"strings"
	"log"
	"net/http"
	"encoding/json"

	"k8s.io/client-go/kubernetes"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/validate"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"github.com/jinzhu/gorm"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
)

type ResourceClient struct {
	K8sClient *kubernetes.Clientset
	DB        *gorm.DB
}

type APIServer struct {
	config         *viper.Viper
	router         *gin.Engine
	verifiers      map[string]validate.Validate
	resourceClient *ResourceClient
}

func NewAPIServer(config *viper.Viper) *APIServer {
	kclient, err := NewKClients(config)
	if err != nil {
		log.Fatalf("Create kubernetes client fail, Stop...: %s", err.Error())
		return nil
	}

	dbclient, err := NewDBClient(config)
	if err != nil {
		log.Fatalf("Create database client fail, Stop...: %s", err.Error())
		return nil
	}

	validateConfig := config.GetStringMap("api-server.validate")
	verifiers := make(map[string]validate.Validate)

	// convert each validate config json to ValidateConfig struct
	// we need two phase conversion, map[string]interface{} -> json -> struct
	// https://www.cnblogs.com/liang1101/p/6741262.html
	for k, v := range validateConfig {

		var vconf model.ValidateConfig

		// map[string]interface{} -> json
		jsonStr, err := json.Marshal(v)
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

		switch oauthProvider := vconf.Type; oauthProvider {
		case "go-oauth":
			verifiers[k] = validate.NewGoAuthValidate(vconf)
		case "github":
			verifiers[k] = validate.NewGithubValidate(vconf)
		default:
			log.Println(fmt.Sprintf("%s is a not supported provider type", oauthProvider))
		}
	}

	if len(verifiers) == 0 {
		log.Fatalf("There is no validater to verify token, Stop...")
		return nil
	}

	return &APIServer{
		config: config,
		resourceClient: &ResourceClient{
			DB:        dbclient,
			K8sClient: kclient,
		},
		router:    gin.Default(),
		verifiers: verifiers,
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

func (server *APIServer) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		//token := c.Request.FormValue("token")

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			util.RespondWithError(http.StatusUnauthorized, "Authorization header is missing", c)
			return
		}

		bearerToken := strings.Split(authHeader, " ")

		if len(bearerToken) != 2 || bearerToken[0] != "Bearer" {
			util.RespondWithError(http.StatusUnauthorized, "Authorization header is not Bearer Token format or token is missing", c)
			return
		}

		var validated bool
		var err error

		// todo: better solution to check token in different provider
		// return when we find token is validated or expired in any one provider
		for providerName, v := range server.verifiers {
			token := bearerToken[1]

			validated, err = v.Validate(token)

			// Because the probability of token collision is very small,
			// return when we find token is validated with any one provider.
			if validated {
				c.Set("Provider", providerName)
				c.Next()
				return
			}

			if err != nil {
				log.Println(fmt.Sprintf("verify token validated with provider {%s} fail: %s", providerName, err.Error()))
				if err.Error() == "Access token expired" {
					util.RespondWithError(http.StatusForbidden, "Access token expired", c)
					return
				}
			}
		}

		// if token is not found in ALL provider, return invalid
		if !validated {
			util.RespondWithError(http.StatusForbidden, "Invalid API token", c)
			return
		}
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
