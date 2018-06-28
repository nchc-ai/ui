package api

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	"net/http"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func (resourceClient *ResourceClient) ListPVC(c *gin.Context) {

	pvcNameList := []model.LabelValue{}
	pvcs, err := resourceClient.K8sClient.CoreV1().PersistentVolumeClaims("default").List(metav1.ListOptions{})
	if err != nil {
		util.RespondWithError(c, http.StatusInternalServerError,
			"List Kubernetes default namespace PVC fail: %s", err.Error())
		return
	}

	for _, pvc := range pvcs.Items {
		lbval := model.LabelValue{
			Label: pvc.Name,
			Value: pvc.Name,
		}
		pvcNameList = append(pvcNameList, lbval)
	}

	c.JSON(http.StatusOK, model.DatasetsListResponse{
		Error:    false,
		Datasets: pvcNameList,
	})

}
