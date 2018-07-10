package api

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"net/http"
)

// todo: implement real list image
func (resourceClient *ResourceClient) ListImage(c *gin.Context) {
	image := map[string]string{
		"tensorflow/tensorflow:1.5.1": "tensorflow/tensorflow:1.5.1",
		"nvidia/digits:5.0":           "nvidia/digits:5.0",
		"nginx:1.7.9":                 "nginx:1.7.9",
	}

	imageList := []model.LabelValue{}

	for k, v := range image {
		lbval := model.LabelValue{
			Label: k,
			Value: v,
		}
		imageList = append(imageList, lbval)
	}

	c.JSON(http.StatusOK, model.ImagesListResponse{
		Error:  false,
		Images: imageList,
	})
}
