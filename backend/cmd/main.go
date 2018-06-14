package main

import (
	"log"
	"flag"
	"github.com/spf13/viper"
	"gitlab.com/nchc-ai/AI-Eduational-Platform/backend/pkg/api"
)

func main() {

	configPath := flag.String("conf", "", "The file path to a config file")
	flag.Parse()

	setDefault()
	config, err := ReadConfig(*configPath)
	if err != nil {
		log.Fatalf("Unable to read configure file: %s", err.Error())
	}

	server := api.NewAPIServer(config)

	if server == nil {
		log.Fatalf("Create api server fail, Stop!!")
		return
	}

	err = server.RunServer()
	if err != nil {
		log.Fatalf("start api server error: %s", err.Error())
	}

}

func setDefault() {
	//Default
	viper.SetDefault("api-server.isOutsideCluster", false)
	viper.SetDefault("api-server.isOutsideCluster", 38080)
}

func ReadConfig(fileConfig string) (*viper.Viper, error) {
	viper := viper.New()
	viper.SetConfigType("json")

	if fileConfig == "" {
		viper.SetConfigName("api-config")
		viper.AddConfigPath("/etc/api-server")
	} else {
		viper.SetConfigFile(fileConfig)
	}

	// overwrite by file
	err := viper.ReadInConfig()
	if err != nil {
		return nil, err
	}

	return viper, nil
}
