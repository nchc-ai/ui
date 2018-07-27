package api

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	"net/http"
	log "github.com/golang/glog"
	"fmt"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/provider"
	"strings"
)

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

func (server *APIServer) Introspection(c *gin.Context) {

	var req model.IntrospectionReq
	err := c.BindJSON(&req)
	if err != nil {
		log.Errorf("Failed to parse spec request request: %s", err.Error())
		util.RespondWithError(c, http.StatusBadRequest, "Failed to parse spec request request: %s", err.Error())
		return
	}

	introspectionResult, err := server.providerProxy.Introspection(req.Token)

	if err != nil {
		errStr := fmt.Sprintf("Introspection Token {%s} fail: %s", req.Token, err.Error())
		log.Errorf(errStr)
		util.RespondWithError(c, http.StatusInternalServerError, errStr)
		return
	}

	c.JSON(http.StatusOK, introspectionResult)
}

func (server *APIServer) Logout(c *gin.Context) {
	// Logout and Introspection use the same request format
	var req model.IntrospectionReq
	err := c.BindJSON(&req)
	if err != nil {
		log.Errorf("Failed to parse spec request request: %s", err.Error())
		util.RespondWithError(c, http.StatusBadRequest, "Failed to parse spec request request: %s", err.Error())
		return
	}

	logoutResp, err := server.providerProxy.Logout(req.Token)

	if err != nil {
		errStr := fmt.Sprintf("Logout use Token {%s} fail: %s", req.Token, err.Error())
		log.Errorf(errStr)
		util.RespondWithError(c, http.StatusInternalServerError, errStr)
		return
	}

	c.JSON(http.StatusOK, logoutResp)
}

func (server *APIServer) RegisterUser(c *gin.Context) {

	var req provider.UserInfo
	err := c.BindJSON(&req)
	if err != nil {
		log.Errorf("Failed to parse spec request request: %s", err.Error())
		util.RespondWithError(c, http.StatusBadRequest, "Failed to parse spec request request: %s", err.Error())
		return
	}

	registerResult, err := server.providerProxy.RegisterUser(&req)

	if err != nil {
		errStr := fmt.Sprintf("Regsiter new user {%s} fail: %s", req.Username, err.Error())
		log.Errorf(errStr)
		util.RespondWithError(c, http.StatusInternalServerError, errStr)
		return
	}

	c.JSON(http.StatusOK, registerResult)

}

func (server *APIServer) UpdateUserBasicInfo(c *gin.Context) {
	updateUser(server, c)
}

func (server *APIServer) QueryUser(c *gin.Context) {

	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		log.Error("Can not find token in Authorization header")
		util.RespondWithError(c, http.StatusBadRequest, "Can not find token in Authorization header")
		return
	}

	bearerToken := strings.Split(authHeader, " ")

	if len(bearerToken) != 2 || bearerToken[0] != "Bearer" {
		log.Errorf("Can not find token in Authorization header: %s", authHeader)
		util.RespondWithError(c, http.StatusBadRequest, "Can not find token in Authorization header")
		return
	}

	token := bearerToken[1]

	result, err := server.providerProxy.QueryUser(token)

	if err != nil {
		errStr := fmt.Sprintf("query user from token fail: %s", err.Error())
		log.Errorf(errStr)
		util.RespondWithError(c, http.StatusInternalServerError, errStr)
		return
	}

	c.JSON(http.StatusOK, result)
}

func (server *APIServer) ChangeUserPassword(c *gin.Context) {
	updateUser(server, c)
}
