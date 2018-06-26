package util

import (
	"os"
	"flag"
	"path/filepath"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/rest"
	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"fmt"
	"net/http"
)

func homeDir() string {
	if h := os.Getenv("HOME"); h != "" {
		return h
	}
	return os.Getenv("USERPROFILE") // windows
}

func GetConfig(isOutOfCluster bool, kubeConfigPath string) (*rest.Config, error) {

	// creates the in-cluster config
	if isOutOfCluster == false {
		config, err := rest.InClusterConfig()
		if err != nil {
			panic(err.Error())
		}
		return config, nil
	}

	// create out-cluster config from specified kubeconfig file
	if kubeConfigPath != "" {
		config, err := clientcmd.BuildConfigFromFlags("", kubeConfigPath)
		if err != nil {
			panic(err.Error())
		}
		return config, nil
	}

	// creates the out-cluster config from HOME
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

	return config, nil
}

func RespondWithError(c *gin.Context, code int, format string, args ...interface{}) {
	resp := genericResponse(true, format, args ...)
	c.JSON(code, resp)
	c.Abort()
}

func RespondWithOk(c *gin.Context, format string, args ...interface{}) {
	resp := genericResponse(false, format, args ...)
	c.JSON(http.StatusOK, resp)
	c.Abort()
}

func genericResponse(isError bool, format string, args ...interface{}) model.GenericResponse {
	resp := model.GenericResponse{
		Error:   isError,
		Message: fmt.Sprintf(format, args ...),
	}
	return resp
}

func Int32Ptr(i int32) *int32 { return &i }
