package model

import "k8s.io/api/core/v1"

type HealthDatabaseResponse struct {
	GenericResponse
	//Error   bool     `json:"error"`
	//Message string   `json:"message"`
	Tables []string `json:"tables"`
}

type GenericResponse struct {
	Error   bool   `json:"error"`
	Message string `json:"message"`
}

type Node struct {
	Name   string               `json:"name"`
	Status v1.NodeConditionType `json:"status"`
}

type HealthKubernetesResponse struct {
	Error   bool   `json:"error"`
	Message []Node `json:"message"`
}

type GenericRequest struct {
	Message string `json:"message"`
}
