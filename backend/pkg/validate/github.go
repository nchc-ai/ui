package validate

import (
	"github.com/spf13/viper"
	"net/http"
)

type Github struct {
	url string
}

func NewGithubValidate(config *viper.Viper) *Github {
	return &Github{
		url: config.GetString("api-server.validate.url"),
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
