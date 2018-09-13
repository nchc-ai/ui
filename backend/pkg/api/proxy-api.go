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


// @Summary Exchange token from Provider
// @Description Exchange token from Provider
// @Tags Proxy
// @Accept  json
// @Produce  json
// @Param token_request body docs.TokenReq true "token request"
// @Success 200 {object} docs.TokenResp
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Router /v1/proxy/token [post]
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

// @Summary Refresh token with provider
// @Description Refresh token with provider
// @Tags Proxy
// @Accept  json
// @Produce  json
// @Param refresh_token body docs.RefreshTokenReq true "refresh token"
// @Success 200 {object} docs.TokenResp
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Router /v1/proxy/refresh [post]
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

// @Summary Get token meta information from provider
// @Description Get token meta information from provider
// @Tags Proxy
// @Accept  json
// @Produce  json
// @Param Introspection_token body docs.IntrospectionReq true "Introspection token"
// @Success 200 {object} docs.IntrospectResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Router /v1/proxy/introspection [post]
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

// @Summary Revoke all tokens of a user
// @Description Revoke all tokens of a user
// @Tags Proxy
// @Accept  json
// @Produce  json
// @Param user_token body docs.IntrospectionReq true "user token"
// @Success 200 {object} docs.PlainResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 401 {object} docs.GenericErrorResponse
// @Failure 403 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Security ApiKeyAuth
// @Router /v1/proxy/logout [post]
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


// @Summary Register a new user
// @Description Register a new user
// @Tags Proxy
// @Accept  json
// @Produce  json
// @Param new_user_info body docs.UserInfo true "user information"
// @Success 200 {object} docs.PlainResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Router /v1/proxy/register [post]
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


// @Summary Update a existing user information
// @Description Update a existing user information
// @Tags Proxy
// @Accept  json
// @Produce  json
// @Param user_info body docs.UpdatedUser true "user information"
// @Success 200 {object} docs.PlainResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 401 {object} docs.GenericErrorResponse
// @Failure 403 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Security ApiKeyAuth
// @Router /v1/proxy/update [post]
func (server *APIServer) UpdateUserBasicInfo(c *gin.Context) {
	updateUser(server, c)
}


// @Summary query a existing user information
// @Description query a existing user information
// @Tags Proxy
// @Accept  json
// @Produce  json
// @Success 200 {object} docs.UserInfo
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 401 {object} docs.GenericErrorResponse
// @Failure 403 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Security ApiKeyAuth
// @Router /v1/proxy/query [get]
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

// @Summary Change user password
// @Description Change user password
// @Tags Proxy
// @Accept  json
// @Produce  json
// @Param user_password body docs.PasswordInfo true "new password"
// @Success 200 {object} docs.PlainResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 401 {object} docs.GenericErrorResponse
// @Failure 403 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Security ApiKeyAuth
// @Router /v1/proxy/changePW [post]
func (server *APIServer) ChangeUserPassword(c *gin.Context) {
	updateUser(server, c)
}
