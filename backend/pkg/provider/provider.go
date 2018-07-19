package provider

type Provider interface {
	GetToken(code string) (*TokenResponse, error)
	RefreshToken(refresh_token string) (*TokenResponse, error)
	Introspection(token string) (*IntrospectResponse, error)
	Validate(token string) (bool, error)
	Name() string
	Logout(token string) (*PlainResponse, error)
	RegisterUser(user *UserInfo) (*PlainResponse, error)
	UpdateUser(user *UserInfo) (*PlainResponse, error)
	QueryUser(token string) (*UserInfo, error)
}
