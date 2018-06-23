package provider

//type Validate interface {
//	Validate(string) (bool, error)
//}

type Provider interface {
	GetToken(code string) (string, error)
	RefreshToken(token string) (string, error)
	Validate(token string) (bool, error)
	Name() string
}

