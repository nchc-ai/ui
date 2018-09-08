package docs

type DatasetsListResponse struct {
	Error    bool                `json:"error"`
	Datasets []DatasetLabelValue `json:"datasets"`
}

type DatasetLabelValue struct {
	Label string `json:"label" example:"dataset1"`
	Value string `json:"value" example:"dataset1"`
}
