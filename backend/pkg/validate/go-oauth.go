package validate

import (
	"net/http"
	"net/url"
	"strings"
	"io/ioutil"
	"github.com/spf13/viper"
	"encoding/json"
)

type GoAuth struct {
	url          string
	clientId     string
	clientSecret string
}

type IntrospectResponse struct {
	Active    bool   `json:"active"`
	Scope     string `json:"scope"`
	ClientId  string `json:"client_id"`
	Username  string `json:"username"`
	TokenType string `json:"token_type"`
	Expire    int64  `json:"exp"`
}

func NewGoAuthValidate(config *viper.Viper) *GoAuth {
	return &GoAuth{
		url:          config.GetString("api-server.validate.url"),
		clientId:     config.GetString("api-server.validate.client_id"),
		clientSecret: config.GetString("api-server.validate.client_secret"),
	}
}

func (g *GoAuth) Validate(token string) (bool, error) {
	client := &http.Client{}
	data := url.Values{}
	data.Add("token", token)
	req, err := http.NewRequest("POST", g.url, strings.NewReader(data.Encode()))
	if err != nil {
		return false, err
	}

	req.SetBasicAuth(g.clientId, g.clientSecret)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		return false, err
	}

	defer resp.Body.Close()

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return false, err
	}

	var introspectResp IntrospectResponse
	err = json.Unmarshal(bodyBytes, &introspectResp)
	if err != nil {
		return false, err
	}
	return introspectResp.Active, nil
}
