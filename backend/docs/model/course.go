package docs

type ListCourseResponse struct {
	Error   bool     `json:"error" example:"false" format:"bool"`
	Courses []Course `json:"courses"`
}

type GetCourseResponse struct {
	Error  bool   `json:"error" example:"false" format:"bool"`
	Course Course `json:"course"`
}

type Search struct {
	Query string `json:"query" example:"course keyword"`
}

type AddCourse struct {
	OauthUser
	Name         string   `json:"name" example:"jimmy的課" format:"string"`
	Introduction string   `json:"introduction" example:"課程說明" format:"string"`
	Image        string   `json:"image" example:"nginx:1.7.9" format:"string"`
	Gpu          uint8    `json:"gpu" example:"1" format:"int64"`
	Level        string   `json:"level" example:"basic" format:"string"`
	Datasets     []string `json:"datasets" example:"cifar-10,caltech256" format:"string"`
}

type Course struct {
	Id           string   `json:"id" example:"49a31009-7d1b-4ff2-badd-e8c717e2256c"`
	CreatedAt    string   `json:"createAt" example:"2018-06-25T09:24:38Z"`
	Name         string   `json:"name" example:"jimmy的課" format:"string"`
	Introduction string   `json:"introduction" example:"課程說明" format:"string"`
	Image        string   `json:"image" example:"nginx:1.7.9" format:"string"`
	Gpu          uint8    `json:"gpu" example:"1" format:"int64"`
	Level        string   `json:"level" example:"basic" format:"string"`
	Datasets     []string `json:"datasets" example:"cifar-10,caltech256" format:"string"`
}

type UpdateCourse struct {
	Id           string   `json:"id" example:"49a31009-7d1b-4ff2-badd-e8c717e2256c"`
	Name         string   `json:"name" example:"jimmy的課" format:"string"`
	Introduction string   `json:"introduction" example:"課程說明" format:"string"`
	Image        string   `json:"image" example:"nginx:1.7.9" format:"string"`
	Gpu          uint8    `json:"gpu" example:"1" format:"int64"`
	Level        string   `json:"level" example:"basic" format:"string"`
	Datasets     []string `json:"datasets" example:"cifar-10,caltech256" format:"string"`
}
