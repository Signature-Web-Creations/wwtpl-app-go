package main

import (
	"github.com/gin-gonic/gin"
)

func initRouter() *gin.Engine {
	router := gin.Default()
	router.GET("/records", PublicRecords)
	router.GET("/records/:id", PublicRecordDetail)

	router.POST("/register", RegisterUser)
	// router.POST("/login", Login)
	return router
}
