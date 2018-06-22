package validate

import (
	"net/http"
	"net/url"
	"strings"
	"io/ioutil"
	"encoding/json"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"errors"
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

type TokenExpire struct {
	Error string `json:"error"`
}

func NewGoAuthValidate(config model.ValidateConfig) *GoAuth {
	return &GoAuth{
		url:          config.Url,
		clientId:     config.ClientId,
		clientSecret: config.ClientSecret,
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

	if resp.StatusCode == http.StatusNotFound {
		return false, errors.New("Access token not found")
	}

	if resp.StatusCode == http.StatusInternalServerError {
		var tokenExpire TokenExpire
		err = json.Unmarshal(bodyBytes, &tokenExpire)
		if err != nil {
			return false, err
		}

		if tokenExpire.Error == "Access token expired" {
			return false, errors.New("Access token expired")
		}
	}

	var introspectResp IntrospectResponse
	err = json.Unmarshal(bodyBytes, &introspectResp)
	if err != nil {
		return false, err
	}
	return introspectResp.Active, nil
}
