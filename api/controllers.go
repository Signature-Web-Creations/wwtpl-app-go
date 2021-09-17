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
	records, err := PublishedHistoryRecords(0)
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, records)
	}
	c.IndentedJSON(http.StatusOK, records)
}

