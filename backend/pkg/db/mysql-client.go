package db

import "github.com/gin-gonic/gin"

func AddRoute(router *gin.Engine) {

	clusterGroup := router.Group("/v1").Group("/health")
	{
		clusterGroup.GET("/database", checkDatabase)
	}

}

func checkDatabase(c *gin.Context) {

}
