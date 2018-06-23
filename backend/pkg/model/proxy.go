package model


type TokenReq struct {
	Code string `json:"code"`
}

type TokenResp struct {
	Token string `json:"token"`
}