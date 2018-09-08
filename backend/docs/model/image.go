package docs


type ImagesListResponse struct {
	Error  bool         `json:"error" example:"false" format:"bool"`
	Images []ImageLabelValue `json:"images"`
}

type ImageLabelValue struct {
	Label string `json:"label" example:"tensorflow/tensorflow:1.5.1"`
	Value string `json:"value" example:"tensorflow/tensorflow:1.5.1"`
}
