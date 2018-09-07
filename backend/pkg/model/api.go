package model

import (
	"k8s.io/api/core/v1"
	"time"
)

type HealthDatabaseResponse struct {
	GenericResponse
	Tables []string `json:"tables"`
}

type GenericResponse struct {
	Error   bool   `json:"error" example:"false" format:"bool"`
	Message string `json:"message" example:"response message" format:"string"`
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
	Error   bool     `json:"error" example:"false" format:"bool"`
	Courses []Course `json:"courses"`
}

type GetCourseResponse struct {
	Error  bool   `json:"error"`
	Course Course `json:"course"`
}

type DatasetsListResponse struct {
	Error    bool         `json:"error"`
	Datasets []LabelValue `json:"datasets"`
}

type ImagesListResponse struct {
	Error  bool         `json:"error"`
	Images []LabelValue `json:"images"`
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
	Ready  bool   `json:"ready"`
	Status string `json:"status"`
}

type LabelValue struct {
	Label string `json:"label"`
	Value string `json:"value"`
}

type JobListResponse struct {
	Error bool      `json:"error"`
	Jobs  []JobInfo `json:"jobs"`
}

type JobInfo struct {
	Id           string       `json:"id"`
	CourseID     string       `json:"course_id"`
	StartAt      time.Time    `json:"startAt"`
	Status       string       `json:"status"`
	Name         string       `json:"name"`
	Introduction string       `json:"introduction"`
	Image        string       `json:"image"`
	GPU          uint8        `json:"gpu"`
	Level        string       `json:"level"`
	Dataset      []string     `json:"dataset"`
	Service      []LabelValue `json:"service"`
}

type Search struct {
	Query string `json:"query" example:"course keyword"`
}
