package validate

import (
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/model"
)

type Dummy struct {
}

func NewDummyValidate(config model.ValidateConfig) *Dummy {
	return &Dummy{}
}

func (g *Dummy) Validate(token string) (bool, error) {
	return true, nil
}
