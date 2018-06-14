package validate

import "github.com/spf13/viper"

type Dummy struct {
}

func NewDummyValidate(config *viper.Viper) *Dummy {
	return &Dummy{}
}

func (g *Dummy) Validate(token string) (bool, error) {
	return true, nil
}
