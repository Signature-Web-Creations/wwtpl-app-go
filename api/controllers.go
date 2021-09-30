package main

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
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
	params["recordStatus"] = c.Query("recordStatus")
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

	recordStatus, err := GetRecordStatuses()
	if err != nil {
		c.IndentedJSON(http.StatusOK, nil)
		return
	} else {
		results["recordStatus"] = recordStatus
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

const SecretKey = "secret"

func Login(c *gin.Context) {
	var json UserLogin

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := GetUserByUsername(json.Username)

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

	expiresAt := time.Now().Add(time.Hour * 24)
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer: strconv.Itoa(int(user.ID)),
		ExpiresAt: expiresAt.Unix(),
	})


	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not login"})
	}

	seconds_in_day := 86400
	c.SetCookie("jwt", token, seconds_in_day, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{"success": "Successfully logged in user.", "user": user})
}

func getAuthenticatedUser(c *gin.Context) (User, bool) {
	// Returns the user if they are authenticated, otherwise returns an false
	// Used to check authentication in controllers where users need to be logged
	// in

	var user User

	cookie, err := c.Cookie("jwt")
	if err != nil {
		return user, false
	}

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		return user, false
	}

	claims := token.Claims.(*jwt.StandardClaims)

	id, err := strconv.Atoi(claims.Issuer)
	if err != nil {
		return user, false
	}

	user, err = GetUserByID(id)
	if err != nil {
		return user, false
	}


	return user, true
}

func GetLoggedInUser(c *gin.Context) {
	user, ok := getAuthenticatedUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User is not logged in"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func GetUsersList(c *gin.Context) {
	user, ok := getAuthenticatedUser(c)
	if !ok || user.Role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User is not authorized"})
	}

	users, err := GetUsers()
	if err != nil {
		fmt.Printf("GetUsersList: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "The server encountered an error. Try again later."})
	}
	c.JSON(http.StatusOK, gin.H{"users": users})
}

func Logout(c *gin.Context) {
	c.SetCookie("jwt", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"success": "Logged out user"})
}
