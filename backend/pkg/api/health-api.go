package api

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	"net/http"
	log "github.com/golang/glog"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// @Summary check backend kubernetes is running, token required
// @Description check backend kubernetes is running, token required
// @Tags HealthCheck
// @Accept  json
// @Produce  json
// @Success 200 {object} docs.HealthKubernetesResponse
// @Failure 401 {object} docs.GenericErrorResponse
// @Failure 403 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Security ApiKeyAuth
// @Router /health/kubernetesAuth [get]
func (resourceClient *ResourceClient) checkK8sAuth(c *gin.Context) {
	resourceClient._checkK8s(c)
}

// @Summary check backend kubernetes is running
// @Description check backend kubernetes is running
// @Tags HealthCheck
// @Accept  json
// @Produce  json
// @Success 200 {object} docs.HealthKubernetesResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Router /health/kubernetes [get]
func (resourceClient *ResourceClient) checkK8s(c *gin.Context) {
	resourceClient._checkK8s(c)
}

func (resourceClient *ResourceClient) _checkK8s(c *gin.Context) {
	statusList := []model.Node{}
	nList, err := resourceClient.K8sClient.KClientSet.CoreV1().Nodes().List(metav1.ListOptions{})

	if err != nil {
		log.Errorf("List Node fail: %s", err.Error())
		util.RespondWithError(c, http.StatusInternalServerError, "List Node fail: %s", err.Error())
		return
	}

	for _, n := range nList.Items {
		a := n.Status.Conditions[len(n.Status.Conditions)-1]
		statusList = append(statusList, model.Node{
			Name:   n.Name,
			Status: a.Type,
		})
	}

	resp := model.HealthKubernetesResponse{
		Error:   false,
		Message: statusList,
	}

	c.JSON(http.StatusOK, resp)
}

// @Summary check backend database is running, token required
// @Description check backend database is running, token required
// @Tags HealthCheck
// @Accept  json
// @Produce  json
// @Param db_name body docs.GenericDBRequest true "show tables in db"
// @Success 200 {object} docs.HealthDatabaseResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 401 {object} docs.GenericErrorResponse
// @Failure 403 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Security ApiKeyAuth
// @Router /health/databaseAuth [post]
func (resourceClient *ResourceClient) checkDatabaseAuth(c *gin.Context) {
	resourceClient._checkDatabase(c)
}

// @Summary check backend database is running
// @Description check backend database is running
// @Tags HealthCheck
// @Accept  json
// @Produce  json
// @Param db_name body docs.GenericDBRequest true "show tables in db"
// @Success 200 {object} docs.HealthDatabaseResponse
// @Failure 400 {object} docs.GenericErrorResponse
// @Failure 500 {object} docs.GenericErrorResponse
// @Router /health/database [post]
func (resourceClient *ResourceClient) checkDatabase(c *gin.Context) {
	resourceClient._checkDatabase(c)
}

func (resourceClient *ResourceClient) _checkDatabase(c *gin.Context) {
	var req model.GenericRequest
	err := c.BindJSON(&req)
	if err != nil {
		log.Errorf("Failed to parse spec request request: %s", err.Error())
		util.RespondWithError(c, http.StatusBadRequest, "Failed to parse spec request request: %s", err.Error())
		return
	}
	msg := req.Message

	tNameList := []string{}

	rows, err := resourceClient.DB.Raw("show tables").Rows()

	if err != nil {
		log.Errorf("Show all table name fail: %s", err.Error())
		util.RespondWithError(c, http.StatusInternalServerError, "Query all table name fail: %s", err.Error())
		return
	}

	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			log.Errorf("Scan table name fail: %s", err.Error())
			util.RespondWithError(c, http.StatusInternalServerError, "Scan table name fail: %s", err.Error())
			return
		}
		tNameList = append(tNameList, name)
	}

	resp := model.HealthDatabaseResponse{
		GenericResponse: model.GenericResponse{
			Error:   false,
			Message: msg,
		},
		Tables: tNameList,
	}

	c.JSON(http.StatusOK, resp)
}
