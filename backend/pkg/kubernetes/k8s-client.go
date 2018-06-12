package kubernetes

import (
	"k8s.io/client-go/kubernetes"
	"github.com/spf13/viper"
	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"log"
	"net/http"
)

type KClients struct {
	K8sClient *kubernetes.Clientset
	// deployment

	// service

	// node
}

func NewKClients(config *viper.Viper) (*KClients, error) {

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

	return &KClients{
		K8sClient: clientset,
	}, nil
}

func (kclient *KClients) AddRoute(router *gin.Engine) {

	clusterGroup := router.Group("/v1").Group("/health")
	{
		clusterGroup.GET("/kubernetes", kclient.checkK8s)
	}

}

func (kclient *KClients) checkK8s(c *gin.Context) {
	statusList := []Node{}
	nList, err := kclient.K8sClient.CoreV1().Nodes().List(metav1.ListOptions{})

	if err != nil {
		c.JSON(http.StatusInternalServerError, GenericResponse{
			Error:   true,
			Message: "List Node fail: " + err.Error(),
		})
		return
	}

	for _, n := range nList.Items {
		a := n.Status.Conditions[len(n.Status.Conditions)-1]
		statusList = append(statusList, Node{
			Name:   n.Name,
			Status: a.Type,
		})
	}

	resp := HealthKubernetesResponse{
		Error:   false,
		Message: statusList,
	}

	c.JSON(http.StatusOK, resp)
}
