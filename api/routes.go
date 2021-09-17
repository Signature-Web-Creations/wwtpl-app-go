package main

import (
	"github.com/gin-gonic/gin"
)

func initRouter() *gin.Engine {
	router := gin.Default()
	router.GET("/records", PublicRecords)
	router.GET("/records/:id", PublicRecordDetail)
	router.GET("/pages/", TotalPages)
	// router.POST("/login", Login)
	return router
}
