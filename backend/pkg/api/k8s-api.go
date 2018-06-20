package api

import (
	"log"
	"net/http"

	"k8s.io/client-go/kubernetes"
	"github.com/spf13/viper"
	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
)

func NewKClients(config *viper.Viper) (*kubernetes.Clientset, error) {

	kConfig, err := util.GetConfig(
		config.GetBool("api-server.isOutsideCluster"),
		config.GetString("kubernetes.kubeconfig"))

	if err != nil {
		log.Fatalf("create kubenetes config fail: " + err.Error())
		return nil, err
	}

	clientset, err := kubernetes.NewForConfig(kConfig)
	if err != nil {
		log.Fatalf("create kubenetes client set fail: " + err.Error())
		return nil, err
	}

	return clientset, nil
}

func (resourceClient *ResourceClient) checkK8s(c *gin.Context) {
	//c.Header("Access-Control-Allow-Origin", "*")

	statusList := []model.Node{}
	nList, err := resourceClient.K8sClient.CoreV1().Nodes().List(metav1.ListOptions{})

	if err != nil {
		c.JSON(http.StatusInternalServerError, model.GenericResponse{
			Error:   true,
			Message: "List Node fail: " + err.Error(),
		})
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
