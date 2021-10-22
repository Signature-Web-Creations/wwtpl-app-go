package routes

import (
	"bytes"
	"encoding/json"
	"io"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"strings"
	"testing"

	"example.com/wwtl-app/database"
	"example.com/wwtl-app/controllers"
)

///////////////////////////////////////////
// Test Helper Functions
//////////////////////////////////////////

// Login with given username and password
// Returns response. Should be 200 if sucessful 
func login(baseURL, username, password string) (*http.Response, error){
	login := make(map[string]string)
	login["username"] = username
	login["password"] = password

	loginJSON, _ := json.Marshal(login)
	return http.Post(fmt.Sprintf("%s/api/login", baseURL), "application/json", bytes.NewReader(loginJSON))
}

// Opens file or panics
func mustOpen(f string) *os.File {
	r, err := os.Open(f)
	if err != nil {
		panic(err)
	}
	return r
}

func TestGetListingInformation(t *testing.T) {
	ts := httptest.NewServer(Create())
	defer ts.Close()

	resp, _ := http.Get(fmt.Sprintf("%s/api/records/", ts.URL))
	want := 404
	if resp.StatusCode != want {
		t.Errorf("Expected status code 404, got %v", resp.StatusCode)
	}
}

func TestLogin(t *testing.T) {
	database.Connect("test.db")
	ts := httptest.NewServer(Create())
	defer ts.Close()

	resp, _ := http.Get(fmt.Sprintf("%s/api/records/", ts.URL))
	want := 404
	if resp.StatusCode != want {
		t.Errorf("Expected status code 404, got %v", resp.StatusCode)
	}


	resp, _ = login(ts.URL, "admin", "admin")

	if resp.StatusCode != 200 {
		t.Errorf("Expected status code 202, got %v", resp.StatusCode)
	}

	foundJWT := false
	for _, cookie := range resp.Cookies() {
		if cookie.Name == "jwt" {
			foundJWT = true
		}
	}

	if !foundJWT {
		t.Errorf("Successful login should have returned JWT")
	}
}

func TestSaveRecord(t *testing.T) {
	database.Connect("test.db")
	ts := httptest.NewServer(Create())
	defer ts.Close()

	resp, err := login(ts.URL, "admin", "admin")
	if err != nil || resp.StatusCode != 200 {
		t.Errorf("TestSaveRecord - Failed to login during test")
		t.Errorf("\tResponse: %v", resp)
		t.Errorf("\tError: %v", err)
		return
	}

	form := url.Values{
		"title": {"Test Title"},
		"content": {"Test Content"},
		"date": {"2021-01-01"},
		"origin": {""},
		"author": {""},
		"recordType": {"1"},
		"sourceArchive": {"1"},
		"recordStatus": {"1"},
		"collections": {"1","3","5"},
	}

	request, err := http.NewRequest("POST", fmt.Sprintf("%s/api/records", ts.URL), strings.NewReader(form.Encode()))
	request.Header.Set("Content-Type", "application/x-www-form-urlencoded; param=value")

	if err != nil {
		t.Errorf("Failed to create request.")
		t.Errorf("\t%v", err)
	}

	for _, cookie := range resp.Cookies() {
		request.AddCookie(cookie)
	}

	client := &http.Client{}
	resp, err = client.Do(request)

	if resp.StatusCode != 200 {
		t.Errorf("TestSaveRecord - Expected response to be 200")
		t.Errorf("\tform: %v", form.Encode())
		t.Errorf("\ttitle: %s", request.PostFormValue("title"))
	}
}

func TestSaveRecordWithFile(t *testing.T) {
	database.Connect("test.db")
	ts := httptest.NewServer(Create())
	defer ts.Close()

	resp, err := login(ts.URL, "admin", "admin")
	if err != nil || resp.StatusCode != 200 {
		t.Errorf("TestSaveRecordWithFile - Failed to login during test")
		t.Errorf("\tResponse: %v", resp)
		t.Errorf("\tError: %v", err)
		return
	}

	cookies := resp.Cookies()

	resp, err = controllers.Upload(
		&http.Client{},
		"POST",
		fmt.Sprintf("%s/api/records", ts.URL),
		cookies,
		map[string]io.Reader{
			"title": strings.NewReader("Title"), 
			"date" : strings.NewReader("2021-01-01"),
			"recordType": strings.NewReader("1"), 
			"sourceArchive": strings.NewReader("1"),
			"collections": strings.NewReader("1"),
			"recordStatus": strings.NewReader("1"),
			"file": mustOpen("test-img.jpg"),
		},
	)

	if resp.StatusCode != 200 {
		t.Errorf("TestSaveRecordWithFile - Expected response to be 200")
		t.Errorf("\tStatusCode = %d", resp.StatusCode)
		return
	}

	type SaveResult struct {
		NewRecordId int64 `json:"newRecordId"`
		Success 		string `json:"success"`
	}

	body := json.NewDecoder(resp.Body)
	var response SaveResult 
	err = body.Decode(&response)
	if err != nil {
			t.Errorf("decoding error - %v", err)
			return 
	} 

	record, err := database.GetRecordDetail(response.NewRecordId)
	
	if err != nil {
		t.Errorf("TestSaveRecordWithFile - failed to get record")
		return
	}

	if record.AttachmentType == nil || *record.AttachmentType != "image" {
		t.Errorf("TestSaveRecordWithFile - attachment type should be image")
		return 
	}

	if record.Filename == nil {
		t.Errorf("TestSaveRecordWithFile - Filename should not be nil")
		return 
	}

	if strings.Contains(*record.Filename, "public/media") {
		t.Errorf("TestSaveRecordWithFile - filename contains path information")
		return
	}

	resp, err = controllers.Upload(
		&http.Client{},
		"POST",
		fmt.Sprintf("%s/api/records", ts.URL),
		cookies,
		map[string]io.Reader{
			"title": strings.NewReader("Title"), 
			"date" : strings.NewReader("2021-01-01"),
			"recordType": strings.NewReader("1"), 
			"sourceArchive": strings.NewReader("1"),
			"collections": strings.NewReader("1"),
			"recordStatus": strings.NewReader("1"),
			"file": mustOpen("test-document.pdf"),
		},
	)


	if resp.StatusCode != 200 {
		t.Errorf("TestSaveRecordWithFile - Expected response to be 200")
		t.Errorf("\tStatusCode = %d", resp.StatusCode)
		return
	}

	body = json.NewDecoder(resp.Body)
	err = body.Decode(&response)
	if err != nil {
			t.Errorf("decoding error - %v", err)
			return 
	} 

	record, err = database.GetRecordDetail(response.NewRecordId)
	
	if err != nil {
		t.Errorf("TestSaveRecordWithFile - failed to get record")
		return
	}

	if record.AttachmentType == nil || *record.AttachmentType != "document" {
		t.Errorf("TestSaveRecordWithFile - attachment type should be document")
		return 
	}

	if record.Filename == nil {
		t.Errorf("TestSaveRecordWithFile - Filename should not be nil")
		return 
	}
}

func TestAddSourceArchive(t *testing.T) {
	database.Connect("test.db")
	ts := httptest.NewServer(Create())
	defer ts.Close()

	resp, _ := login(ts.URL, "admin", "admin")

	form := url.Values{
		"name": {"new source archive"},
	}

	request, err := http.NewRequest("POST",
		fmt.Sprintf("%s/api/source_archive", ts.URL),
		strings.NewReader(form.Encode()))

	request.Header.Set("Content-Type", "application/x-www-form-urlencoded; param=value")

	if err != nil {
		t.Errorf("Failed to create request.")
		t.Errorf("\t%v", err)
	}

	for _, cookie := range resp.Cookies() {
		request.AddCookie(cookie)
	}

	client := &http.Client{}
	resp, err = client.Do(request)

	if resp.StatusCode != 200 {
		t.Errorf("Failed to save source archive") 
		t.Errorf("\terror: %v", err)
	}
}

func TestLogPageViews(t *testing.T) {
	var c1, c2 int
	var err error 

	database.Connect("test.db")
	ts := httptest.NewServer(Create())
	defer ts.Close()

	if c1, err = database.PageViewsForToday(); err != nil {
		t.Errorf("Failed to get page views for today")
		t.Errorf("\terr: %v", err)
		return
	}
	

	resp, _ := http.Get(fmt.Sprintf("%s/", ts.URL))
	if resp.StatusCode != 200 {
		t.Errorf("Failed to get home page")
		t.Errorf("\tStatusCode: %d", resp.StatusCode)
		return
	}

	if c2, err = database.PageViewsForToday(); err != nil {
		t.Errorf("Failed to get page views for today")
		t.Errorf("\terr: %v", err)
		return
	}

	if c2 != c1 + 1 {
		t.Errorf("Visiting home page should increase page count by 1")
	}

}
