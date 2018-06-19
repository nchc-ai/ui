package model

// todo: Use Config object to read configuration

type DBConfig struct {
}

type APIConfig struct {
}

type K8SConfig struct {
}

type Config struct {
	APIConfig APIConfig `json:"api-server"`
	DBConfig  DBConfig  `json:"database"`
	K8SConfig K8SConfig `json:"kubernetes"`
}
