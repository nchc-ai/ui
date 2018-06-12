package kubernetes

import "k8s.io/api/core/v1"

type Node struct {
	Name   string               `json:"name"`
	Status v1.NodeConditionType `json:"status"`
}

type GenericResponse struct {
	Error   bool   `json:"error"`
	Message string `json:"message"`
}

type HealthKubernetesResponse struct {
	Error   bool   `json:"error"`
	Message []Node `json:"message"`
}
