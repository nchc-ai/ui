package main

import (
	"os"
	"k8s.io/client-go/tools/clientcmd"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	apiv1 "k8s.io/api/core/v1"
	appsv1 "k8s.io/api/apps/v1"

	argoclientset "github.com/argoproj/argo/pkg/client/clientset/versioned"

	"k8s.io/client-go/rest"
	"flag"
	"path/filepath"
	"github.com/gin-gonic/gin"

	"net/http"
	"k8s.io/client-go/kubernetes"
	"fmt"
	"github.com/argoproj/argo/pkg/apis/workflow/v1alpha1"
)

var router *gin.Engine

var clientset *kubernetes.Clientset

var WFClient *argoclientset.Clientset

type response struct {
	Message string `json:"message"`
}

type Deploy struct {
	Replica int32 `json:"replica"`
}

func main() {

	isOutOfCluster := flag.Bool("OutCluster", false, "Is out of cluster")
	flag.Parse()

	config := getConfig(*isOutOfCluster)

	var err error

	clientset, err = kubernetes.NewForConfig(config)
	if err != nil {
		panic(err.Error())
	}

	WFClient, err = argoclientset.NewForConfig(config)
	if err != nil {
		panic(err.Error())
	}

	router = gin.Default()
	initializeRoutes()
	router.Run()

}

func initializeRoutes() {
	router.GET("/getPod", getPod)
	router.POST("/createDeploy", createDeploy)
	router.OPTIONS("/createDeploy", createOption)

	router.GET("/getWorkflow", getWorkflow)
	router.POST("/createWorkflow", createWorkflow)
	router.OPTIONS("/createWorkflow", createOption)
}

func getWorkflow(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")

	list, err := WFClient.ArgoprojV1alpha1().Workflows("default").List(metav1.ListOptions{})
	if err != nil {
		panic(err.Error())
	}

	r := response{
		Message: fmt.Sprintf("There are %d workflow in the default namespace", len(list.Items)),
	}
	c.JSON(http.StatusOK, r)

}

func getPod(c *gin.Context) {

	c.Header("Access-Control-Allow-Origin", "*")

	pods, err := clientset.CoreV1().Pods("default").List(metav1.ListOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": true,
			"cause": "Failed to parse spec request request: " + err.Error(),
		})
		return
	}

	r := response{
		Message: fmt.Sprintf("There are %d pods in the default namespace", len(pods.Items)),
	}

	c.JSON(http.StatusOK, r)
}

func createWorkflow(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")

	var req response
	err := c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": true,
			"cause": "Failed to parse spec request request: " + err.Error(),
		})
		return
	}

	client := WFClient.ArgoprojV1alpha1().Workflows("default")

	wf := &v1alpha1.Workflow{
		ObjectMeta: metav1.ObjectMeta{
			GenerateName: "aaa-bbb-",
		},

		Spec: v1alpha1.WorkflowSpec{
			Entrypoint: "whalesax",
			Templates: []v1alpha1.Template{
				{
					Name: "whalesax",
					Container: &apiv1.Container{
						Image:   "docker/whalesay",
						Command: []string{"cowsay"},
						Args:    []string{req.Message},
					},
				},
			},
		},
	}

	result, err := client.Create(wf)
	if err != nil {
		panic(err)
	}

	r := response{
		Message: fmt.Sprintf("Created workflow %s", result.Name),
	}
	c.JSON(http.StatusOK, r)
}

func createOption(c *gin.Context) {
	//	setup headers
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin")
	c.Status(http.StatusOK)
}

func createDeploy(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")

	deploymentsClient := clientset.AppsV1().Deployments("default")

	var req Deploy
	err := c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": true,
			"cause": "Failed to parse spec request request: " + err.Error(),
		})
		return
	}

	replica := req.Replica

	deployment := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name: "demo-deployment",
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: int32Ptr(replica),
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"app": "demo",
				},
			},
			Template: apiv1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"app": "demo",
					},
				},
				Spec: apiv1.PodSpec{
					Containers: []apiv1.Container{
						{
							Name:  "web",
							Image: "nginx:1.12",
							Ports: []apiv1.ContainerPort{
								{
									Name:          "http",
									Protocol:      apiv1.ProtocolTCP,
									ContainerPort: 80,
								},
							},
						},
					},
				},
			},
		},
	}

	result, err := deploymentsClient.Create(deployment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": true,
			"cause": "Create deployment fail: " + err.Error(),
		})
		return
	}

	r := response{
		Message: fmt.Sprintf("Created deployment %s", result.GetObjectMeta().GetName()),
	}
	c.JSON(http.StatusOK, r)
}

func int32Ptr(i int32) *int32 { return &i }

func homeDir() string {
	if h := os.Getenv("HOME"); h != "" {
		return h
	}
	return os.Getenv("USERPROFILE") // windows
}

func getConfig(isOutOfCluster bool) *rest.Config {

	// creates the in-cluster config
	if isOutOfCluster == false {
		config, err := rest.InClusterConfig()
		if err != nil {
			panic(err.Error())
		}
		return config
	}

	// creates the out-cluster config
	var kubeconfig *string
	if home := homeDir(); home != "" {
		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
	}
	flag.Parse()

	// use the current context in kubeconfig
	config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
	if err != nil {
		panic(err.Error())
	}

	return config
}
