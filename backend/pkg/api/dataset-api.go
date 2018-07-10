package api

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	"net/http"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"strings"
)

func (resourceClient *ResourceClient) ListPVC(c *gin.Context) {

	pvcNameList := []model.LabelValue{}
	namespace := resourceClient.K8sClient.namespace
	pvcs, err := resourceClient.K8sClient.KClientSet.CoreV1().PersistentVolumeClaims(namespace).List(metav1.ListOptions{})
	if err != nil {
		util.RespondWithError(c, http.StatusInternalServerError,
			"List Kubernetes default namespace PVC fail: %s", err.Error())
		return
	}

	for _, pvc := range pvcs.Items {
		// dataset pvc name should start with "dataset-"
		//https://gitlab.com/nchc-ai/AI-Eduational-Platform/issues/18#note_86408557
		if strings.HasPrefix(pvc.Name, "dataset-") {
			r := strings.SplitN(pvc.Name, "-", 2)
			lbval := model.LabelValue{
				Label: r[1],
				Value: pvc.Name,
			}
			pvcNameList = append(pvcNameList, lbval)
		}
	}

	c.JSON(http.StatusOK, model.DatasetsListResponse{
		Error:    false,
		Datasets: pvcNameList,
	})

}
