package provider

import (
	"net/http"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"golang.org/x/oauth2"
	"errors"
)

type Github struct {
	url string
}

func NewGithubValidate(config model.ProviderConfig) *Github {
	return &Github{
		url: config.IntrospectURL,
	}
}

func (g *Github) Validate(token string) (bool, error) {
	client := &http.Client{}

	req, _ := http.NewRequest("GET", g.url, nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, _ := client.Do(req)
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		return true, nil
	} else {
		return false, nil
	}
}

func (g *Github) GetToken(code string) (*oauth2.Token, error) {
	return nil, errors.New("Not implement")
}

func (g *Github) RefreshToken(token string) (*oauth2.Token, error) {
	return nil, errors.New("Not implement")
}

func (g *Github) Name() string {
	return "github"
}
