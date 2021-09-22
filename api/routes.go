package main

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func initRouter() *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowCredentials: true,
	}))

	router.GET("/records", PublicRecords)
	router.GET("/records/:id", PublicRecordDetail)

	router.POST("/register", RegisterUser)
	router.POST("/login", Login)
	// router.POST("/login", Login)
	return router
}
