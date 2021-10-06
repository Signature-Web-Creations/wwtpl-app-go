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

// Returns JSON response containing a public record detail
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

// Options that determine whether to
// return a HistoryRecord
type HistoryRecordOptions struct {
	KeepDeleted  bool  `json:"keepDeleted"`
	AdminOnly    bool  `json:"adminOnly`
	RecordStatus int64 `json:"recordStatus"`
}

// Returns a HistoryRecord by it's id
// User must be authenticated
// It decides whether to return a HistoryRecord by options
// Sent in the request
func RecordDetail(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error. Bad request"})
		return
	}

	_, ok := getAuthenticatedUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User is not authorized."})
		return
	}

	record, err := GetRecordDetail(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internval server error"})
		fmt.Printf("Error: %v", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"record": record})

}

func getQueryParams(c *gin.Context) map[string]interface{} {
	// Get query parameters from url
	// if query parameters is absent return an empty string
	params := make(map[string]interface{})

	offset, err := strconv.Atoi(c.Query("offset"))
	if err != nil {
		params["offset"] = 0
	} else {
		params["offset"] = offset
	}

	params["query"] = c.Query("query")
	params["year"] = c.Query("year")
	params["recordType"] = c.Query("recordType")
	params["collection"] = c.Query("collection")
	params["sourceArchive"] = c.Query("sourceArchive")
	params["recordStatus"] = c.Query("recordStatus")
	return params
}

// Gets Listing information for editors, admins, and publishers
// and returns it as in JSON body. The only difference between 
// editors, publishers and admins is the corresponding database
// function that is used to retrieve records. Users that are not
// logged in receive a 401. 
func GetListingInformation(c *gin.Context) {
	var err error
	user, ok := getAuthenticatedUser(c)
	if !ok {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "User is not authorized"})
		return
	}

	results := make(map[string]interface{})
	params := getQueryParams(c)

	var records []HistoryRecord
	var pages int 
	switch user.Role {
		case "editor": 
			records, pages, err = EditorListings(user, params)
		case "publisher": 
			records, pages, err = PublisherListings(user, params)
		case "admin": 
			records, pages, err = AdminListings(params)
		default:
			c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "An internal service error has occured."})
			fmt.Printf("GetListingInformation: unknown user role: '%s'\n", user.Role)
			return
	}

	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "An internal service error has occured."})
		return
	} 

	results["records"] = records
	results["pages"] = pages

	years, err := GetYears()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["years"] = years

	collections, err := GetCollections()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	} 
	results["collections"] = collections

	sourceArchives, err := GetSourceArchives()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["sourceArchives"] = sourceArchives

	recordTypes, err := GetRecordTypes()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["recordTypes"] = recordTypes

	recordStatus, err := GetRecordStatuses()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	} 
	results["recordStatus"] = recordStatus

	c.IndentedJSON(http.StatusOK, results)
}

// Sends JSON information for public listings. 
// Includes records, number of pages, 
// record_statuses, source archives, collections
// and years.  
func GetPublicListings(c *gin.Context) {
	params := getQueryParams(c)

	records, err := PublishedHistoryRecords(params)
	results := make(map[string]interface{})

	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	} 

	results["records"] = records

	pages, err := CountPublishedPages(params)
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	} 
	results["pages"] = pages

	years, err := GetYears()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["years"] = years

	collections, err := GetCollections()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	} 
	results["collections"] = collections

	sourceArchives, err := GetSourceArchives()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["sourceArchives"] = sourceArchives

	recordTypes, err := GetRecordTypes()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["recordTypes"] = recordTypes

	recordStatus, err := GetRecordStatuses()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	} 
	results["recordStatus"] = recordStatus

	c.IndentedJSON(http.StatusOK, results)
}

// User Authentication Controllers

type NewUser struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Username  string `json:"username" binding:"required"`
	Password  string `json:"password" binding:"required"`
	RoleId    int64  `json:"roleId" binding:"required"`
}

// Creates an new user if valid
func RegisterUser(c *gin.Context) {
	var json NewUser

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, ok := getAuthenticatedUser(c)
	if !ok || user.Role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User is not authorized."})
		return
	}

	err := CreateUser(json)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "Successfully created user"})
}

// TODO: replace secret key with a randomly generated file loaded from confifuration file
const SecretKey = "secret"

// Login Credentials
type UserLogin struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Login a user based on username and password
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

	if !user.Active {
		fmt.Println("Disabled users cannot login")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "disabled user cannot login. See administrator"})
		return
	}

	err = bcrypt.CompareHashAndPassword(user.Password, []byte(json.Password))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "invalid username/password"})
		return
	}

	expiresAt := time.Now().Add(time.Hour * 24)
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
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

// Returns the user if they are authenticated, otherwise returns an false
// Used to check authentication in controllers where users need to be logged
// in
func getAuthenticatedUser(c *gin.Context) (User, bool) {

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

func GetUserRoles(c *gin.Context) {
	roles, err := GetRoles()
	if err != nil {
		fmt.Printf("GetUserRoles: %v\n", err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user roles."})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"roles": roles})
}

// JSON that represents a specific user
// used to select a user when editing/disabling
// users
type UserID struct {
	ID int64 `json:"userId" binding:"required"`
}

func DisableUser(c *gin.Context) {
	var json UserID
	data := map[string]interface{}{
		"active": 0,
	}

	user, ok := getAuthenticatedUser(c)
	if !ok || user.Role != "admin" {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "User is not authorized"})
		return
	}

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := UpdateUser(json.ID, data)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't process request. Try again later"})
		fmt.Printf("DisableUser: %v\n", err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "Successfully disabled user"})
}

func SaveRecord(c *gin.Context) {
	var json HistoryRecordJSON
	var err error

	user, ok := getAuthenticatedUser(c)
	if !ok {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "User is not authorized"})
		return
	}

	if err = c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if json.ID == 0 {
		err = InsertRecord(user, json)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't process request. Try again later"})
		fmt.Printf("InsertRecord: %v\n", err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "Successfully created record"})
}
