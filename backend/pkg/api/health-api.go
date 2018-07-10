package api

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	"net/http"
	log "github.com/golang/glog"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func (resourceClient *ResourceClient) checkK8s(c *gin.Context) {
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

func (resourceClient *ResourceClient) checkDatabase(c *gin.Context) {
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
