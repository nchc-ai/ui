package provider

//type Validate interface {
//	Validate(string) (bool, error)
//}

type Provider interface {
	GetToken(code string) (*TokenResponse, error)
	RefreshToken(refresh_token string) (*TokenResponse, error)
	Validate(token string) (bool, error)
	Name() string
}
