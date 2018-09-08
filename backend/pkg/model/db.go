package model

import (
	"time"
)

type OauthUser struct {
	User     string `gorm:"size:50;not null" json:"user,omitempty"`
	Provider string `gorm:"size:30;not null" json:"-"`
}

type Model struct {
	ID        string     `gorm:"primary_key;size:36" json:"id"`
	CreatedAt time.Time  `json:"createAt"`
	UpdatedAt time.Time  `json:"-"`
	DeletedAt *time.Time `sql:"index" json:"-"`
}

type Course struct {
	Model
	OauthUser

	Name         string `gorm:"not null" json:"name"`
	Introduction string `gorm:"size:3000" json:"introduction"`
	Image        string `gorm:"not null" json:"image"`
	Gpu          uint8  `gorm:"not null;default:0" json:"gpu"`
	Level        string `gorm:"not null;default:'basic';size:10" json:"level"`

	//gorm many-to-many associations
	Datasets []string `gorm:"-" json:"datasets"`

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
