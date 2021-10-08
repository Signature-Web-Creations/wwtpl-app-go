package routes

import (
	"example.com/wwtl-app/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func Create() *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowCredentials: true,
	}))

	router.Use(static.Serve("/", static.LocalFile("./public", true)))

	router.GET("/api/public/records", controllers.GetPublicListings)
	router.GET("/api/public/records/:id", controllers.PublicRecordDetail)

	router.POST("/api/user", controllers.RegisterUser)
	router.POST("/api/login", controllers.Login)
	router.POST("/api/logout", controllers.Logout)
	router.GET("/api/user", controllers.GetLoggedInUser)
	router.GET("/api/users", controllers.GetUsersList)
	router.GET("/api/user_roles", controllers.GetUserRoles)
	router.POST("/api/user/disable", controllers.DisableUser)

	// Dashboard / Admin Routes
	router.GET("/api/records/", controllers.GetListingInformation)
	router.GET("/api/records/:id", controllers.RecordDetail)
	router.POST("/api/records", controllers.SaveRecord)
	router.POST("/api/records/:id", controllers.UpdateRecord)
	router.POST("/api/records/status/:id", controllers.ChangeRecordStatus) 

	return router
}
