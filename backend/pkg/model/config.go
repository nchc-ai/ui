package model

// todo: Use Config object to read configuration

type DBConfig struct {
}

type APIConfig struct {
}

type K8SConfig struct {
}

type Endpoint struct {
	AuthURL       string `json:"auth_url"`
	TokenURL      string `json:"token_url"`
	IntrospectURL string `json:"introspect_url"`
	RefreshURL    string `json:"refresh_url"`
	LogoutURL     string `json:"logout_url"`
}

type ProviderConfig struct {
	Endpoint
	Type         string `json:"type"`
	Name         string `json:"name"`
	RedirectURL  string `json:"redirect_url"`
	ClientId     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
}

type Config struct {
	APIConfig APIConfig `json:"api-server"`
	DBConfig  DBConfig  `json:"database"`
	K8SConfig K8SConfig `json:"kubernetes"`
}
