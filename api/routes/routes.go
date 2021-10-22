package routes

import (
	"fmt"

	"example.com/wwtl-app/controllers"
	"example.com/wwtl-app/database"

	"github.com/gin-contrib/cors"
	// "github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func logPageView(fn func(c *gin.Context)) func(c *gin.Context) {
	return func(c *gin.Context) {
		fmt.Println("Visiting the home page")
		database.LogPageViews() 
		fn(c) 
	}
}

func renderIndex(c *gin.Context) {
	fmt.Println("Rendering home page")
	c.File("./public/index.html")
}

func Create() *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowCredentials: true,
	}))

	/*
	router.GET("/media/:name", func (c *gin.Context) {
		name := c.Param("name")
		c.FileFromFS(name, http.FileServer(http.Dir("./public/media"))
	})
	*/

	router.GET("/css/:name", func (c *gin.Context) {
		name := c.Param("name") 
		fmt.Printf("Loaded css: %s\n", name)
		c.File(fmt.Sprintf("./public/css/%s", name))
	})

	router.GET("/css/wix/:name", func (c *gin.Context) {
		name := c.Param("name") 
		fmt.Printf("Loaded wix css: %s\n", name)
		c.File(fmt.Sprintf("./public/css/wix/%s", name))
	})

	router.GET("/js/:name", func (c *gin.Context) {
		name := c.Param("name") 
		fmt.Printf("Loaded js: %s\n", name)
		c.File(fmt.Sprintf("./public/js/%s", name))
	})

	router.GET("/static/css/:name", func (c *gin.Context) {
		name := c.Param("name") 
		fmt.Printf("Loaded static css: %s\n", name)
		c.File(fmt.Sprintf("./public/static/css/%s", name))
	})

	router.GET("/static/js/:name", func (c *gin.Context) {
		name := c.Param("name") 
		fmt.Printf("Loaded static js: %s\n", name)
		c.File(fmt.Sprintf("./public/static/js/%s", name))
	})

	router.GET("/media/:name", func (c *gin.Context) {
		name := c.Param("name")
		c.File(fmt.Sprintf("./public/media/%s", name))
	})


	routes := []string{
		"/admin",
		"/login",
		"/logout",
		"/users",
		"/adduser",
		"/sourceArchives",
		"/addSourceArchive",
		"/record/new",
		"/record/edit/:id",
		"/record/view/:id",
	}

	for _, route := range routes {
		router.GET(route, renderIndex)
	}

	router.GET("/", logPageView(renderIndex))

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
	router.POST("/api/records/delete/:id", controllers.DeleteRecord)
	router.POST("/api/records/restore/:id", controllers.RestoreRecord)

	router.GET("/api/sourceArchives", controllers.GetSourceArchives)
	router.GET("/api/collections", controllers.GetCollections)
	router.GET("/api/recordTypes", controllers.GetRecordTypes)

	router.POST("/api/sourceArchives", controllers.AddName("source archive", "source_archive"))
	router.POST("/api/collections", controllers.AddName("collection", "collection"))
	router.POST("/api/recordTypes", controllers.AddName("record type", "record_type"))

	return router
}
