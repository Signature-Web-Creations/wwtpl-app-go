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

	router.GET("/api/public/records", PublicRecords)
	router.GET("/api/public/records/:id", PublicRecordDetail)

	router.POST("/api/register", RegisterUser)
	router.POST("/api/login", Login)
	router.POST("/api/logout", Logout)
	router.GET("/api/user", GetLoggedInUser)
	return router
}
