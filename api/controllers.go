package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
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
