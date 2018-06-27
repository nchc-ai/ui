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

type ListCourseResponse struct {
	Error   bool     `json:"error"`
	Courses []Course `json:"courses"`
}

type DatasetsListResponse struct {
	Error    bool         `json:"error"`
	Datasets []LabelValue `json:"datasets"`
}

type LaunchCourseRequest struct {
	User     string `json:"user"`
	CourseId string `json:"course_id"`
}

type LaunchCourseResponse struct {
	Error bool      `json:"error"`
	Job   JobStatus `json:"job"`
}

type JobStatus struct {
	JobId  string `json:"job_id"`
	Status string `json:"status"`
}

type LabelValue struct {
	Label string `json:"label"`
	Value string `json:"value"`
}
