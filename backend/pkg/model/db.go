package model

import (
	"time"
)

type OauthUser struct {
	// todo: go-swagger still show user json field in example when empty
	User     string `gorm:"size:50;not null" json:"user,omitempty"`
	Provider string `gorm:"size:30;not null" json:"-"`
}

type Model struct {
	ID        string     `gorm:"primary_key;size:36" json:"id" example:"550e8400-e29b-41d4-a716-446655440000" format:"uuid"`
	CreatedAt time.Time  `json:"createAt" example:"2018-06-28T07:58:18Z" format:"string"`
	UpdatedAt time.Time  `json:"-"`
	DeletedAt *time.Time `sql:"index" json:"-"`
}

type Course struct {
	Model
	OauthUser

	Name         string `gorm:"not null" json:"name" example:"jimmy的課" format:"string"`
	Introduction string `gorm:"size:3000" json:"introduction" example:"課程說明" format:"string"`
	Image        string `gorm:"not null" json:"image" example:"nginx:1.7.9" format:"string"`
	Gpu          uint8  `gorm:"not null;default:0" json:"gpu" example:"1" format:"int64"`
	Level        string `gorm:"not null;default:'basic';size:10" json:"level" example:"basic" format:"string"`

	//gorm many-to-many associations
	Datasets []string `gorm:"-" json:"datasets" example:"dataset2,dateset3" format:"string"`

	//gorm has-many associations
	Jobs []Job `json:"-"`
}

func (Course) TableName() string {
	return "courses"
}

type Job struct {
	Model
	OauthUser
	// foreign key
	CourseID string `gorm:"size:36"`

	//Deployment string `gorm:"not null"`
	Service string `gorm:"not null"`
	//ProxyUrl   string `gorm:"not null"`
	Status string `gorm:"not null"`
}

func (Job) TableName() string {
	return "jobs"
}

type Dataset struct {
	// foreign key
	CourseID    string `gorm:"primary_key;size:36"`
	DatasetName string `gorm:"primary_key"`
}

func (Dataset) TableName() string {
	return "datasets"
}
