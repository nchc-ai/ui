package api

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	"net/http"
	log "github.com/golang/glog"
	"fmt"
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
