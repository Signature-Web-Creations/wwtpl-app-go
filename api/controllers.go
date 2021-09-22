package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"strconv"
)

func PublicRecordDetail(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		fmt.Printf("Error: %v", err)
		return
	}

	record, err := HistoryRecordByID(id)
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, record)
	} else {
		c.IndentedJSON(http.StatusOK, record)
	}
}

func getQueryParams(c *gin.Context) map[string]string {
	// Get query parameters from url
	// if query parameters is absent return an empty string
	params := make(map[string]string)
	params["query"] = c.Query("query")
	params["year"] = c.Query("year")
	params["recordType"] = c.Query("recordType")
	params["collection"] = c.Query("collection")
	params["sourceArchive"] = c.Query("sourceArchive")
	return params
}

func PublicRecords(c *gin.Context) {
	params := getQueryParams(c)

	offset, err := strconv.Atoi(c.Query("offset"))
	if err != nil {
		offset = 0
	}

	records, err := PublishedHistoryRecords(offset, params)
	results := make(map[string]interface{})

	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	} else {
		results["records"] = records
	}

	pages, err := CountPages(params)
	if err != nil {
		c.IndentedJSON(http.StatusOK, nil)
		return
	} else {
		results["pages"] = pages
	}

	years, err := GetYears()
	if err != nil {
		c.IndentedJSON(http.StatusOK, nil)
		return
	} else {
		results["years"] = years
	}

	collections, err := GetCollections()
	if err != nil {
		c.IndentedJSON(http.StatusOK, nil)
		return
	} else {
		results["collections"] = collections
	}

	sourceArchives, err := GetSourceArchives()
	if err != nil {
		c.IndentedJSON(http.StatusOK, nil)
		return
	} else {
		results["sourceArchives"] = sourceArchives
	}

	recordTypes, err := GetRecordTypes()
	if err != nil {
		c.IndentedJSON(http.StatusOK, nil)
		return
	} else {
		results["recordTypes"] = recordTypes
	}
	c.IndentedJSON(http.StatusOK, results)
}

// User Authentication Controllers

type NewUser struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Username  string `json:"username" binding:"required"`
	Password  string `json:"password" binding:"required"`
}

func RegisterUser(c *gin.Context) {
	var json NewUser

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := CreateUser(json)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": "Successfully created user"})
}

type UserLogin struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var json UserLogin

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := GetUser(json.Username)

	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{"error": "invalid username/password"})
		return
	}

	err = bcrypt.CompareHashAndPassword(user.Password, []byte(json.Password))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "invalid username/password"})
		return
	}

	// TODO set Session and JWT If the code reaches this point
	// The user is authenticated.
	c.JSON(http.StatusOK, gin.H{"success": "Successfully logged in user."})
}
