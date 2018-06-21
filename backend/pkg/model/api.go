package model

import "k8s.io/api/core/v1"

type HealthDatabaseResponse struct {
	GenericResponse
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

type CourseInfo struct {
	Id           string   `json:"id"`
	Name         string   `json:"name"`
	Introduction string   `json:"introduction"`
	Image        string   `json:"image"`
	Level        string   `json:"level"`
	GPU          uint8    `json:"gpu"`
	Datasets     []string `json:"datasets"`
}

type ListCourseResponse struct {
	Error   bool         `json:"error"`
	Courses []CourseInfo `json:"courses"`
}
