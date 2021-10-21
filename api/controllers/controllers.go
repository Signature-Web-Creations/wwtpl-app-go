package controllers

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	db "example.com/wwtl-app/database"
	"example.com/wwtl-app/models"
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

	record, err := db.HistoryRecordByID(id)
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, record)
	} else {
		c.IndentedJSON(http.StatusOK, record)
	}
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

	record, err := db.GetRecordDetail(id)

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
		c.IndentedJSON(http.StatusNotFound, gin.H{"error": "Not found"})
		return
	}

	results := make(map[string]interface{})
	params := getQueryParams(c)

	var records []models.HistoryRecord
	var pages int
	switch user.Role {
	case "editor":
		records, pages, err = db.EditorListings(user, params)
	case "publisher":
		records, pages, err = db.PublisherListings(user, params)
	case "admin":
		records, pages, err = db.AdminListings(params)
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

	years, err := db.GetYears()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["years"] = years

	collections, err := db.GetCollections()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["collections"] = collections

	sourceArchives, err := db.GetSourceArchives()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["sourceArchives"] = sourceArchives

	recordTypes, err := db.GetRecordTypes()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["recordTypes"] = recordTypes

	recordStatus, err := db.GetRecordStatuses()
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

	records, err := db.PublishedHistoryRecords(params)
	results := make(map[string]interface{})

	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}

	results["records"] = records

	pages, err := db.CountPublishedPages(params)
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["pages"] = pages

	years, err := db.GetYears()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["years"] = years

	collections, err := db.GetCollections()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["collections"] = collections

	sourceArchives, err := db.GetSourceArchives()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["sourceArchives"] = sourceArchives

	recordTypes, err := db.GetRecordTypes()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["recordTypes"] = recordTypes

	recordStatus, err := db.GetRecordStatuses()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	}
	results["recordStatus"] = recordStatus

	c.IndentedJSON(http.StatusOK, results)
}

// User Authentication Controllers

// Creates an new user if valid
func RegisterUser(c *gin.Context) {
	var json models.NewUser

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, ok := getAuthenticatedUser(c)
	if !ok || user.Role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User is not authorized."})
		return
	}

	err := db.CreateUser(json)
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

	user, err := db.GetUserByUsername(json.Username)

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
func getAuthenticatedUser(c *gin.Context) (models.User, bool) {

	var user models.User

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

	user, err = db.GetUserByID(id)
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

	users, err := db.GetUsers()
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
	roles, err := db.GetRoles()
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

	err := db.UpdateUser(json.ID, data)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't process request. Try again later"})
		fmt.Printf("DisableUser: %v\n", err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "Successfully disabled user"})
}

// Populates and validates a form
func Validate(c *gin.Context, form *models.HistoryRecordForm) error {
	form.Title = c.PostForm("title")
	if form.Title == "" {
		return fmt.Errorf("Validate: %s", "Title is required")
	}

	form.Content = c.PostForm("content")

	form.Date = c.PostForm("date")
	if form.Date == "" {
		return fmt.Errorf("Validate: %s", "Date is required")
	}

	form.Origin = c.PostForm("origin")
	form.Author = c.PostForm("author")

	recordTypeID, err := strconv.ParseInt(c.PostForm("recordType"), 10, 64)
	if err != nil {
		return fmt.Errorf("Validate: Couldn't convert record type")
	}
	form.RecordTypeID = recordTypeID

	sourceArchiveID, err := strconv.ParseInt(c.PostForm("sourceArchive"), 10, 64)
	if err != nil {
		return fmt.Errorf("Validate: Couldn't convert source archive")
	}
	form.SourceArchiveID = sourceArchiveID

	recordStatusID, err := strconv.ParseInt(c.PostForm("recordStatus"), 10, 64)
	if err != nil {
		return fmt.Errorf("Validate: Couldn't convert record status")
	}
	form.RecordStatusID = recordStatusID

	var collections []int64

	for _, collection := range strings.Split(c.PostForm("collections"), ",") {
		collectionID, err := strconv.ParseInt(collection, 10, 64)
		if err != nil {
			return fmt.Errorf("Validate: Couldn't convert collections => %s", collection)
		}
		collections = append(collections, collectionID)
	}
	form.Collections = collections

	file, err := c.FormFile("file")
	if err == nil {
		form.File = file
	}

	return nil
}

const mediaDir = "./public/media"

// Uploads a form to a given url
func Upload(client *http.Client, method, url string, cookies []*http.Cookie, values map[string]io.Reader) (*http.Response, error) {
	var b bytes.Buffer
	var err error
	w := multipart.NewWriter(&b)
	for key, r := range values {
		var fw io.Writer
		if x, ok := r.(io.Closer); ok {
			defer x.Close()
		}

		// Add a file
		if x, ok := r.(*os.File); ok {
			if fw, err = w.CreateFormFile(key, x.Name()); err != nil {
				return nil, err
			}
		} else {
			if fw, err = w.CreateFormField(key); err != nil {
				return nil, err
			}
		}

		if _, err := io.Copy(fw, r); err != nil {
			return nil, err
		}
	}

	w.Close()

	req, err := http.NewRequest(method, url, &b)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", w.FormDataContentType())
	for _, cookie := range cookies {
		req.AddCookie(cookie)
	}

	return client.Do(req)
}

// Save file to media directory
func SaveFile(c *gin.Context, form *models.HistoryRecordForm) error {
	file := form.File

	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	out, err := os.CreateTemp(mediaDir, "uploads")
	if err != nil {
		return fmt.Errorf("SaveFile - %s", err.Error())
	}
	filename := filepath.Base(out.Name())
	defer out.Close() 

	_, err = io.Copy(out, src)

	if _, err = io.Copy(out, src); err != nil {
		return fmt.Errorf("SaveFile err: %s", err.Error())
	}


	f, err := form.File.Open()
	if err != nil {
		return fmt.Errorf("SaveFile err: %s", err.Error())
	}
	defer f.Close()

	buffer := make([]byte, 512)
	_, err = f.Read(buffer)
	if err != nil {
		return fmt.Errorf("SaveFile err: %s", err.Error())
	}

	var attachmentTypeId int64
	switch http.DetectContentType(buffer) {
	case "application/pdf":
		attachmentTypeId = models.Document
	case "text/plain":
		attachmentTypeId = models.Document
	case "image/gif":
		attachmentTypeId = models.Image
	case "image/png":
		attachmentTypeId = models.Image
	case "image/jpeg":
		attachmentTypeId = models.Image
	default:
		attachmentTypeId = models.Document
	}

	form.Attachment = &models.FileAttachment{
		AttachmentTypeId: attachmentTypeId,
		Filename:         filename,
	}

	return nil
}

func SaveRecord(c *gin.Context) {
	var form models.HistoryRecordForm
	var err error

	user, ok := getAuthenticatedUser(c)
	if !ok {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "User is not authorized"})
		return
	}

	err = Validate(c, &form)

	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if form.File != nil {
		err := SaveFile(c, &form)
		if err != nil {
			fmt.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	newRecordId, err := db.InsertRecord(user, form)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't process request. Try again later"})
		fmt.Printf("InsertRecord: %v\n", err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "Successfully created record", "newRecordId": newRecordId})
}

func UpdateRecord(c *gin.Context) {
	var form models.HistoryRecordForm
	var err error

	recordID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, ok := getAuthenticatedUser(c)
	if !ok {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "User is not authorized"})
		return
	}

	err = Validate(c, &form)

	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err = db.UpdateRecord(recordID, form); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't process request. Try again later"})
		fmt.Printf("UpdateRecord: %v\n", err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "Successfully updated record"})
}

type RecordStatusID struct {
	ID int64 `json:"recordStatusId"`
}

func ChangeRecordStatus(c *gin.Context) {
	var json RecordStatusID
	var err error

	user, ok := getAuthenticatedUser(c)
	if !ok || user.Role == "editor" {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "User is not authorized"})
		return
	}

	recordID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err = c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = db.ChangeStatus(recordID, json.ID)
	if err != nil {
		fmt.Printf("ChangeRecordStatus: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't process request. Try again later"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "Successfully changed status"})
}

func DeleteRecord(c *gin.Context) {
	user, ok := getAuthenticatedUser(c)
	if !ok ||user.Role != "admin" {
		c.IndentedJSON(http.StatusNotFound, gin.H{"error": "Could not find resource."})
		return
	}

	recordID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Internal server error"})
		return
	}

	if err := db.DeleteRecord(recordID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return 
	}

	c.JSON(http.StatusOK, gin.H{"success": "Successfully deleted record"})
}


func RestoreRecord(c *gin.Context) {
	user, ok := getAuthenticatedUser(c)
	if !ok ||user.Role != "admin" {
		c.IndentedJSON(http.StatusNotFound, gin.H{"error": "Could not find resource."})
		return
	}

	recordID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Internal server error"})
		return
	}

	if err := db.RestoreRecord(recordID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return 
	}

	c.JSON(http.StatusOK, gin.H{"success": "Successfully deleted record"})
}

func GetSourceArchives(c *gin.Context) {
	sourceArchives, err := db.GetSourceArchives()

	if err != nil {
		fmt.Printf("GetSourceArchives - %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resource"})
		return 
	}

	c.JSON(http.StatusOK, gin.H{"sourceArchives": sourceArchives})
}

func GetRecordTypes(c *gin.Context) {
	recordTypes, err := db.GetRecordTypes()

	if err != nil {
		fmt.Printf("GetRecordTypes - %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resource"})
		return 
	}

	c.JSON(http.StatusOK, gin.H{"recordTypes": recordTypes})
}

func GetCollections(c *gin.Context) {
	collections, err := db.GetCollections()

	if err != nil {
		fmt.Printf("GetCollections - %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve resource"})
		return 
	}

	c.JSON(http.StatusOK, gin.H{"collections": collections.Collections})
}

func AddName(displayName, tableName string) func(c *gin.Context) {
	return func(c *gin.Context) {	
		user, ok := getAuthenticatedUser(c)
		if !ok ||user.Role != "admin" {
			c.IndentedJSON(http.StatusNotFound, gin.H{"error": "Could not find resource."})
			return
		}

		name := c.PostForm("name") 
		if name == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
			return 
		}

		err := db.InsertName(tableName, "name")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to insert name"})
			return
		}

		c.JSON(http.StatusOK,
			gin.H{"success": fmt.Sprintf("Successfully inserted %s", displayName)})
	}
}
