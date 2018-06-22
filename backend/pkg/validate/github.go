package validate

import (
	"net/http"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
)

type Github struct {
	url string
}

func NewGithubValidate(config model.ValidateConfig) *Github {
	return &Github{
		url: config.Url,
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
