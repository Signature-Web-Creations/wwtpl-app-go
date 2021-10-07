package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func initRouter() *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowCredentials: true,
	}))

	router.Use(static.Serve("/", static.LocalFile("./public", true)))

	router.GET("/api/public/records", GetPublicListings)
	router.GET("/api/public/records/:id", PublicRecordDetail)

	router.POST("/api/user", RegisterUser)
	router.POST("/api/login", Login)
	router.POST("/api/logout", Logout)
	router.GET("/api/user", GetLoggedInUser)
	router.GET("/api/users", GetUsersList)
	router.GET("/api/user_roles", GetUserRoles)
	router.POST("/api/user/disable", DisableUser)

	// Dashboard / Admin Routes
	router.GET("/api/records/", GetListingInformation)
	router.GET("/api/records/:id", RecordDetail)
	router.POST("/api/records", SaveRecord)
	router.POST("/api/records/status/:id", ChangeRecordStatus) 

	return router
}
