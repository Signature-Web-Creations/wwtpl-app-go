package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"example.com/database"
)



type Login struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResult struct {
	Succeeded bool `json:"succeeded"`
	ErrorMessage string `json:"errorMessage"`
}

func authenticate(login Login) bool {
	// TODO: 
	// need to hash password, get user and then check that the
	// has stored in the database matches up with the hash stored
	// in the databse
	return login.Username == "admin" && login.Password == "password"
}

func loginHandler(c *gin.Context) {
	var json Login
	var result LoginResult

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H {"error": "invalid username/password"})
		return 
	}


	if authenticate(json) {
		result.Succeeded = true

		c.SetCookie("username", json.Username, 3600, "/", "", true, true)
		c.IndentedJSON(http.StatusOK, result)
	} else {
		result.Succeeded = false
		result.ErrorMessage = "invalid username/password"
		c.IndentedJSON(http.StatusOK, result)
	}
}


func getRecords(c *gin.Context) {
	records, err := database.PublishedHistoryRecords(0)
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, records)
	}
	c.IndentedJSON(http.StatusOK, records)
}

func getRecordByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		fmt.Printf("Error: %v", err)
		return
	}

	record, err := database.HistoryRecordByID(id)
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, record)
	} else {
		c.IndentedJSON(http.StatusOK, record)
	}
}

func main() {
	database.Connect()

	fmt.Println("Running Williamsport-Washington Township Public Library - History Database")
	fmt.Println("Server is listening on localhost:8080")
	fmt.Println("Successfuly connected to Database")
	fmt.Println("Close this window or enter Ctrl+C to quit")

	router := gin.Default()
	router.GET("/records", getRecords)
	router.GET("/records/:id", getRecordByID)
	router.POST("/login", loginHandler)
	router.Run("localhost:8080")
}

