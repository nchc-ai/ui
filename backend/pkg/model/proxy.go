package model

type TokenReq struct {
	Code string `json:"code"`
}

type RefreshTokenReq struct {
	RefreshToken string `json:"refresh_token"`
}

type TokenResp struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token"`
}