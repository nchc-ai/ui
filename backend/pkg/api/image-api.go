package api

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"net/http"
	"io/ioutil"
	"encoding/json"
	log "github.com/golang/glog"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/util"
	"fmt"
	"errors"
)

const DockerHubURL = "https://registry.hub.docker.com/v2/repositories/nchcai/train/tags/"

func listhubimage() ([]string, error) {
	req, err := http.NewRequest("GET", DockerHubURL, nil)

	if err != nil {
		return nil, err
	}

	req.Header.Add("Cache-Control", "no-cache")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()
	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	var arbitrary_json map[string]interface{}
	err = json.Unmarshal(data, &arbitrary_json)
	if err != nil {
		return nil, err
	}

	var tag []string
	for k, v := range arbitrary_json {
		if k == "results" {
			ja, ok := v.([]interface{})
			if !ok {
				return nil, errors.New(fmt.Sprintf("cast json array fail: { %s }", v))
			}

			for _, vv := range ja {
				resultiv, ok := vv.(map[string]interface{})
				if !ok {
					return nil, errors.New(fmt.Sprintf("cast map fail: %s", vv))
				}
				tag = append(tag, resultiv["name"].(string))
			}
		}
	}

	return tag, nil
}

func (resourceClient *ResourceClient) ListImage(c *gin.Context) {

	imgs, err := listhubimage()
	if err != nil {
		log.Errorf("Failed to get images information from Dockerhub: %s", err.Error())
		util.RespondWithError(c, http.StatusInternalServerError, "Failed to get images information from Dockerhub: %s", err.Error())
		return
	}

	imageList := []model.LabelValue{}

	for _, n := range imgs {
		lbval := model.LabelValue{
			Label: fmt.Sprintf("nchcai/train:%s", n),
			Value: fmt.Sprintf("nchcai/train:%s", n),
		}
		imageList = append(imageList, lbval)
	}

	c.JSON(http.StatusOK, model.ImagesListResponse{
		Error:  false,
		Images: imageList,
	})
}
