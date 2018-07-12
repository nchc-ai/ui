package provider

import (
	"net/http"
	"net/url"
	"strings"
	"io/ioutil"
	"encoding/json"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"errors"
	"golang.org/x/oauth2"
)

type GoAuth struct {
	name           string
	refresh_url    string
	introspect_url string
	logout_url     string
	oauthConfig    *oauth2.Config
}

type LogoutResponse struct {
	Message string `json:"message"`
}

type IntrospectResponse struct {
	Active    bool   `json:"active"`
	Scope     string `json:"scope"`
	ClientId  string `json:"client_id"`
	Username  string `json:"username"`
	TokenType string `json:"token_type"`
	Expire    int64  `json:"exp"`
	Role      string `json:"role"`
}

type TokenResponse struct {
	User         string `json:"user_id"`
	AccessToken  string `json:"access_token"`
	expire       int    `json:"expires_in"`
	TokenType    string `json:"token_type"`
	Scope        string `json:"scope"`
	RefreshToken string `json:"refresh_token"`
}

type TokenExpire struct {
	Error string `json:"error"`
}

func NewGoAuthProvider(config model.ProviderConfig) *GoAuth {

	var endpoint = oauth2.Endpoint{
		AuthURL:  config.AuthURL,
		TokenURL: config.TokenURL,
	}

	var oauthConfig = &oauth2.Config{
		ClientID:     config.ClientId,
		ClientSecret: config.ClientSecret,
		RedirectURL:  config.RedirectURL,
		Endpoint:     endpoint,
	}

	return &GoAuth{
		name:           config.Name,
		refresh_url:    config.RefreshURL,
		introspect_url: config.IntrospectURL,
		logout_url:     config.LogoutURL,
		oauthConfig:    oauthConfig,
	}
}

func (g *GoAuth) Validate(token string) (bool, error) {
	client := &http.Client{}
	data := url.Values{}
	data.Add("token", token)
	req, err := http.NewRequest("POST", g.introspect_url, strings.NewReader(data.Encode()))
	if err != nil {
		return false, err
	}

	req.SetBasicAuth(g.oauthConfig.ClientID, g.oauthConfig.ClientSecret)
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

func (g *GoAuth) GetToken(code string) (*TokenResponse, error) {

	token, err := g.oauthConfig.Exchange(oauth2.NoContext, code)

	if err != nil {
		return nil, err
	}

	return &TokenResponse{
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken,
	}, nil
}

func (g *GoAuth) RefreshToken(refresh_token string) (*TokenResponse, error) {
	client := &http.Client{}
	data := url.Values{
		"refresh_token": {refresh_token},
		"grant_type":    {"refresh_token"},
	}
	req, err := http.NewRequest("POST", g.refresh_url, strings.NewReader(data.Encode()))
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth(g.oauthConfig.ClientID, g.oauthConfig.ClientSecret)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode == http.StatusNotFound {
		return nil, errors.New("Refresh token not found")
	}

	var tokenResp TokenResponse
	err = json.Unmarshal(bodyBytes, &tokenResp)
	if err != nil {
		return nil, err
	}

	return &tokenResp, nil
}

func (g *GoAuth) Introspection(token string) (*IntrospectResponse, error) {
	client := &http.Client{}
	data := url.Values{}
	data.Add("token", token)
	req, err := http.NewRequest("POST", g.introspect_url, strings.NewReader(data.Encode()))
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth(g.oauthConfig.ClientID, g.oauthConfig.ClientSecret)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		var errResp model.ErrResp
		err = json.Unmarshal(bodyBytes, &errResp)
		if err != nil {
			return nil, err
		}

		return nil, errors.New(errResp.Error)
	}

	var introspectResp IntrospectResponse
	err = json.Unmarshal(bodyBytes, &introspectResp)
	if err != nil {
		return nil, err
	}

	return &introspectResp, nil

}

func (g *GoAuth) Name() string {
	return g.name
}

func (g *GoAuth) Logout(token string) (*LogoutResponse, error) {

	client := &http.Client{}
	data := url.Values{}
	data.Add("token", token)
	req, err := http.NewRequest("POST", g.logout_url, strings.NewReader(data.Encode()))
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth(g.oauthConfig.ClientID, g.oauthConfig.ClientSecret)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		var errResp model.ErrResp
		err = json.Unmarshal(bodyBytes, &errResp)
		if err != nil {
			return nil, err
		}

		return nil, errors.New(errResp.Error)
	}

	var logoutResp LogoutResponse
	err = json.Unmarshal(bodyBytes, &logoutResp)
	if err != nil {
		return nil, err
	}

	return &logoutResp, nil
}
