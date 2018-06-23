package provider

import (
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
)

type Dummy struct {
}

func NewDummyValidate(config model.ProviderConfig) *Dummy {
	return &Dummy{}
}

func (g *Dummy) Validate(token string) (bool, error) {
	return true, nil
}

func (g *Dummy) GetToken(code string) (string, error) {
	return "", nil
}

func (g *Dummy) RefreshToken(token string) (string, error) {
	return "", nil
}

func (g *Dummy) Name() string {
	return "dummy"
}