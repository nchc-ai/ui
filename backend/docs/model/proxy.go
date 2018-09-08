package docs

type PlainResponse struct {
	Message string `json:"message" example:"response from proxy"`
}

type UserInfo struct {
	Username    string `json:"username" example:"jjj@abc.com"`
	Password    string `json:"password" example:"654321"`
	ChineseName string `json:"cName" example:"莊莊莊"`
	Company     string `json:"company" example:"國網中心"`
	Email1      string `json:"email-1" example:"ogre@ggg.com"`
	Email2      string `json:"email-2" example:"ogre@ggg.com"`
	Phone       string `json:"phone" example:"0911234567"`
	Text        string `json:"text" example:""`
}
type UpdatedUser struct {
	Username    string `json:"username" example:"jjj@abc.com"`
	ChineseName string `json:"cName" example:"莊莊莊"`
	Company     string `json:"company" example:"國網中心"`
	Email1      string `json:"email-1" example:"ogre@ggg.com"`
	Email2      string `json:"email-2" example:"ogre@ggg.com"`
	Phone       string `json:"phone" example:"0911234567"`
	Text        string `json:"text" example:""`
}

type PasswordInfo struct {
	Username string `json:"username" example:"jjj@abc.com"`
	Password string `json:"password" example:"654321"`
}

type IntrospectResponse struct {
	Active    bool   `json:"active" example:"true" format:"bool"`
	Scope     string `json:"scope" example:"read_write"`
	ClientId  string `json:"client_id" example:"test_client_1"`
	Username  string `json:"username" example:"ogre0403@gmail.com"`
	TokenType string `json:"token_type" example:"Bearer"`
	Expire    int64  `json:"exp" example:"1530672296" format:"int64"`
	Role      string `json:"role" example:"user"`
}

type TokenReq struct {
	Code string `json:"code" example:"f1bd4604-e5ce-469d-b3d7-5e1d8a3e87d7"`
}

type IntrospectionReq struct {
	Token string `json:"token" example:"045e8bd5-58dc-4bd5-8254-dc3d1571c9cd"`
}

type RefreshTokenReq struct {
	RefreshToken string `json:"refresh_token" example:"7e7f6442-09e0-44f3-a05b-d7ea516cc6c5"`
}

type TokenResp struct {
	Token        string `json:"token" example:"045e8bd5-58dc-4bd5-8254-dc3d1571c9cd"`
	RefreshToken string `json:"refresh_token" example:"7e7f6442-09e0-44f3-a05b-d7ea516cc6c5"`
}
