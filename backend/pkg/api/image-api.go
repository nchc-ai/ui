package api

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"net/http"
	"io/ioutil"
	"encoding/json"
)

func listhubimage()[100]string{
						    url := "https://registry.hub.docker.com/v2/repositories/nchcai/train/tags/"
							req, _ := http.NewRequest("GET", url, nil)
							req.Header.Add("Cache-Control", "no-cache")
							res, _ := http.DefaultClient.Do(req)
							defer res.Body.Close()
							data, _ := ioutil.ReadAll(res.Body)
							jdata := []byte(string(data))
							var u interface{}
							json.Unmarshal(jdata, &u)
							result,ok := u.(map[string]interface{})
							var tag [100]string
					if ok{
						for _, v := range result {
							switch v2 := v.(type) {
								case []interface{}:
									for i, iv := range v2 {
									resultiv,_ := iv.(map[string]interface{})
							  		x := resultiv["name"].(string)
									tag[i] = x
									}
							}
						}
					}
				return  tag
			}


// todo: implement real list image
func (resourceClient *ResourceClient) ListImage(c *gin.Context) {
	
	x :=listhubimage()
	hubimage := map[string]string{}
	for i:=0;i<100;i++{
		if x[i]!=""{
			fmt.Println(x[i])
			imagename := "nchcai/train:"+x[i]
			hubimage[imagename]=imagename
		}
	}


/*	image := map[string]string{
		"tensorflow/tensorflow:1.5.1": "tensorflow/tensorflow:1.5.1",
		"nvidia/digits:5.0":           "nvidia/digits:5.0",
		"nginx:1.7.9":                 "nginx:1.7.9",
	}
*/
	imageList := []model.LabelValue{}

	for k, v := range hubimage {
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
