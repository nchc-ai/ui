// GENERATED BY THE COMMAND ABOVE; DO NOT EDIT
// This file was generated by swaggo/swag at
// 2018-09-07 17:32:19.07950691 +0800 CST m=+0.050472370

package docs

import (
	"github.com/swaggo/swag"
)

var doc = `{
    "swagger": "2.0",
    "info": {
        "description": "AI Train API.",
        "title": "AI Train API",
        "contact": {},
        "license": {},
        "version": "1.0"
    },
    "host": "localhost:38080",
    "basePath": "/v1",
    "paths": {
        "/course/create/": {
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Add new course information into database",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Course"
                ],
                "summary": "Add new course information",
                "parameters": [
                    {
                        "description": "course information",
                        "name": "course",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.Course"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "403": {
                        "description": "Forbidden",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    }
                }
            }
        },
        "/course/delete/{id}": {
            "delete": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "All associated job, Deployment and svc in kubernetes are also deleted.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Course"
                ],
                "summary": "Delete course information",
                "parameters": [
                    {
                        "type": "string",
                        "description": "course uuid, eg: 131ba8a9-b60b-44f9-83b5-46590f756f41",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "403": {
                        "description": "Forbidden",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    }
                }
            }
        },
        "/course/get/{id}": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get one courses information by course id",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Course"
                ],
                "summary": "Get one courses information by course id",
                "parameters": [
                    {
                        "type": "string",
                        "description": "course uuid, eg: 131ba8a9-b60b-44f9-83b5-46590f756f41",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GetCourseResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "403": {
                        "description": "Forbidden",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    }
                }
            }
        },
        "/course/level/{level}": {
            "get": {
                "description": "List basic or advance courses information",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Course"
                ],
                "summary": "List basic or advance courses information",
                "parameters": [
                    {
                        "type": "string",
                        "description": "basic or advance",
                        "name": "level",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.ListCourseResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    }
                }
            }
        },
        "/course/list": {
            "get": {
                "description": "get all course information",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Course"
                ],
                "summary": "List all course information",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.ListCourseResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    }
                }
            },
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "List someone's all courses information",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Course"
                ],
                "summary": "List someone's all courses information",
                "parameters": [
                    {
                        "description": "search user course",
                        "name": "list_user",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.OauthUser"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.ListCourseResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "403": {
                        "description": "Forbidden",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    }
                }
            }
        },
        "/course/search": {
            "post": {
                "description": "Search course name",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Course"
                ],
                "summary": "Search course name",
                "parameters": [
                    {
                        "description": "search keyword",
                        "name": "search",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.Search"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.ListCourseResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    }
                }
            }
        },
        "/course/update/": {
            "put": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Update course information",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Course"
                ],
                "summary": "Update course information",
                "parameters": [
                    {
                        "description": "new course information",
                        "name": "course",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.Course"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "403": {
                        "description": "Forbidden",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "$ref": "#/definitions/model.GenericResponse"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "model.Course": {
            "type": "object",
            "properties": {
                "createAt": {
                    "type": "string",
                    "format": "string",
                    "example": "2018-06-28T07:58:18Z"
                },
                "datasets": {
                    "description": "gorm many-to-many associations",
                    "type": "array",
                    "format": "string",
                    "items": {
                        "type": "string"
                    },
                    "example": [
                        "dataset2",
                        "dateset3"
                    ]
                },
                "gpu": {
                    "type": "integer",
                    "format": "int64",
                    "example": 1
                },
                "id": {
                    "type": "string",
                    "format": "uuid",
                    "example": "550e8400-e29b-41d4-a716-446655440000"
                },
                "image": {
                    "type": "string",
                    "format": "string",
                    "example": "nginx:1.7.9"
                },
                "introduction": {
                    "type": "string",
                    "format": "string",
                    "example": "課程說明"
                },
                "level": {
                    "type": "string",
                    "format": "string",
                    "example": "basic"
                },
                "name": {
                    "type": "string",
                    "format": "string",
                    "example": "jimmy的課"
                },
                "user": {
                    "description": "todo: go-swagger still show user json field in example when empty",
                    "type": "string"
                }
            }
        },
        "model.GenericResponse": {
            "type": "object",
            "properties": {
                "error": {
                    "type": "boolean",
                    "format": "bool",
                    "example": false
                },
                "message": {
                    "type": "string",
                    "format": "string",
                    "example": "response message"
                }
            }
        },
        "model.GetCourseResponse": {
            "type": "object",
            "properties": {
                "course": {
                    "type": "object",
                    "$ref": "#/definitions/model.Course"
                },
                "error": {
                    "type": "boolean"
                }
            }
        },
        "model.ListCourseResponse": {
            "type": "object",
            "properties": {
                "courses": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/model.Course"
                    }
                },
                "error": {
                    "type": "boolean",
                    "format": "bool",
                    "example": false
                }
            }
        },
        "model.OauthUser": {
            "type": "object",
            "properties": {
                "user": {
                    "description": "todo: go-swagger still show user json field in example when empty",
                    "type": "string"
                }
            }
        },
        "model.Search": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "example": "course keyword"
                }
            }
        }
    },
    "securityDefinitions": {
        "ApiKeyAuth": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    }
}`

type s struct{}

func (s *s) ReadDoc() string {
	return doc
}
func init() {
	swag.Register(swag.Name, &s{})
}
