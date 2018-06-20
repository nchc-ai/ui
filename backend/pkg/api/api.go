package api

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/kubernetes"
	"strconv"
	"log"

	_ "github.com/jinzhu/gorm/dialects/mysql"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/db"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/validate"
	"net/http"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"fmt"
	"strings"
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
		config:    config,
		k8sClient: kclient,
		dbClient:  dbclient,
		router:    gin.Default(),
		verifier:  verifier,
	}
}

func (server *APIServer) RunServer() error {

	defer server.dbClient.DB.Close()

	// add middleware
	server.router.Use(server.CORSHeaderMiddleware())

	// add route
	server.k8sClient.AddRoute(server.router, server.AuthMiddleware())
	server.dbClient.AddRoute(server.router, server.AuthMiddleware())

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

		// todo: verify if token is expire

		c.Next()
	}
}

func (server *APIServer) CORSHeaderMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Next()
	}
}
