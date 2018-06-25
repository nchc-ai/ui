package provider

import (
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
	"golang.org/x/oauth2"
)

type Dummy struct {
}

func NewDummyValidate(config model.ProviderConfig) *Dummy {
	return &Dummy{}
}

func (g *Dummy) Validate(token string) (bool, error) {
	return true, nil
}

func (g *Dummy) GetToken(code string) (*oauth2.Token, error) {
	return nil, nil
}

func (g *Dummy) RefreshToken(token string) (*oauth2.Token, error) {
	return nil, nil
}

func (g *Dummy) Name() string {
	return "dummy"
}