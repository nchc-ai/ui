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
	"bytes"
	"log"
	"fmt"
)

type GoAuth struct {
	name           string
	refresh_url    string
	introspect_url string
	logout_url     string
	register_url   string
	update_url     string
	query_url      string
	oauthConfig    *oauth2.Config
}

type PlainResponse struct {
	Message string `json:"message"`
}

type UserInfo struct {
	Username    string `json:"username"`
	Password    string `json:"password,omitempty"`
	ChineseName string `json:"cName"`
	Company     string `json:"company"`
	Email1      string `json:"email-1"`
	Email2      string `json:"email-2" `
	Phone       string `json:"phone"`
	Text        string `json:"text"`
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
		register_url:   config.RegisterURL,
		update_url:     config.UpdateURL,
		query_url:      config.QueryURL,
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

	body, err := g.query(token, g.introspect_url)

	if err != nil {
		return nil, err
	}

	var introspectResp IntrospectResponse
	err = json.Unmarshal(body, &introspectResp)
	if err != nil {
		return nil, err
	}

	return &introspectResp, nil
}

func (g *GoAuth) Name() string {
	return g.name
}

func (g *GoAuth) Logout(token string) (*PlainResponse, error) {

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

	var logoutResp PlainResponse
	err = json.Unmarshal(bodyBytes, &logoutResp)
	if err != nil {
		return nil, err
	}

	return &logoutResp, nil
}

func (g *GoAuth) RegisterUser(user *UserInfo) (*PlainResponse, error) {
	return g.registerOrUpdate(user, g.register_url)
}

func (g *GoAuth) UpdateUser(user *UserInfo) (*PlainResponse, error) {
	return g.registerOrUpdate(user, g.update_url)
}

func (g *GoAuth) registerOrUpdate(user *UserInfo, url string) (*PlainResponse, error) {
	jsonStr, err := json.Marshal(user)
	if err != nil {
		log.Fatalf(fmt.Sprintf(":%s", err.Error()))
		return nil, err
	}

	log.Println(string(jsonStr))

	client := &http.Client{}
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth(g.oauthConfig.ClientID, g.oauthConfig.ClientSecret)
	//req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Content-Type", "application/json")

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

	var regsiterResp PlainResponse
	err = json.Unmarshal(bodyBytes, &regsiterResp)
	if err != nil {
		return nil, err
	}

	return &regsiterResp, nil
}

func (g *GoAuth) QueryUser(token string) (*UserInfo, error) {

	body, err := g.query(token, g.query_url)

	if err != nil {
		return nil, err
	}

	var userInfoResp UserInfo
	err = json.Unmarshal(body, &userInfoResp)
	if err != nil {
		return nil, err
	}

	return &userInfoResp, nil
}

func (g *GoAuth) query(token string, q_url string) ([]byte, error) {
	client := &http.Client{}
	data := url.Values{}
	data.Add("token", token)
	req, err := http.NewRequest("POST", q_url, strings.NewReader(data.Encode()))
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

	return bodyBytes, nil
}
