package main

import (
	"github.com/gin-gonic/gin"
	"fmt"
	"net/http"
	"strconv"
)

func TotalPages(c *gin.Context) {
	records_per_page := 50
	pages, err := CountPages(records_per_page)

	if err != nil {
		fmt.Printf("Total Pages: %v\n", err)
		c.IndentedJSON(http.StatusOK, gin.H{"error": "Couldn't get number of pages"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"pages": pages})
}

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

func PublicRecords(c *gin.Context) {
	params := make(map[string]string)

	offset, err := strconv.Atoi(c.Query("offset"))
	if err != nil {
		offset = 0
	}

	params["query"] = c.Query("query") 
	params["year"] = c.Query("year") 
	
	records, err := PublishedHistoryRecords(offset, params)
	results := make(map[string]interface{})

	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, nil)
		return
	} else {
		results["records"] = records
	}

	pages, err := CountPages(50)
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

	c.IndentedJSON(http.StatusOK, results)
}

