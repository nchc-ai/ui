package model

import "github.com/jinzhu/gorm"

type OauthUser struct {
	User     string `gorm:"size:50;not null"`
	Provider string `gorm:"size:30;not null"`
}

type Course struct {
	gorm.Model
	OauthUser

	Name  string `gorm:"not null"`
	Intro string `gorm:"size:3000"`
	Image string `gorm:"not null"`
	Gpu   uint8  `gorm:"not null;default:0"`
	Level string `gorm:"not null;default:'basic';size:10"`
	//gorm many-to-many associations
	//Datasets []Dataset `gorm:"many2many:course_dataset;"`

	//gorm has-many associations
	Jobs []Job
}

func (Course) TableName() string {
	return "courses"
}

type Job struct {
	gorm.Model
	// foreign key
	CourseID uint

	Deployment string `gorm:"not null"`
	Service    string `gorm:"not null"`
	ProxyUrl   string `gorm:"not null"`
	Status     string `gorm:"not null"`
}

func (Job) TableName() string {
	return "jobs"
}

//todo: dataset info is retrived from k8s PVC or from DB
// from DB: need sync to db at some time
// from PVC: can not use gorm many-to-many association directly

//type Dataset struct {
//	gorm.Model
//	Name string `gorm:"not null"`
//}

type Dataset struct {
	CourseID    uint   `gorm:"primary_key"`
	DatasetName string `gorm:"primary_key"`
}

func (Dataset) TableName() string {
	return "datasets"
}
