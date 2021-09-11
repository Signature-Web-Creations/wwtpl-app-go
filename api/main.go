package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"log"
	"net/http"
	"strconv"
)

var db *sql.DB

type HistoryRecord struct {
	ID             int64   `json:"id"`
	Date           string  `json:"date"`
	Title          string  `json:"title"`
	Content        string  `json:"content"`
	Origin         string  `json:"origin"`
	Author         string  `json:"author"`
	SourceArchive  *string `json:"sourceArchive"`
	AttachmentType *string `json:"attachmentType"`
	FileName       *string `json:"fileName"`
	RecordType     *string `json:"recordType"`
	Collections    *string `json:"collections"`
}

func getRecords(c *gin.Context) {
	records, err := publishedHistoryRecords(0)
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

	record, err := historyRecordByID(id)
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, record)
	} else {
		c.IndentedJSON(http.StatusOK, record)
	}
}

func main() {
	dsn := "file:archive.db"

	var err error
	db, err = sql.Open("sqlite3", dsn)

	if err != nil {
		log.Fatal(err)
	}

	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}

	fmt.Println("Running Williamsport-Washington Township Public Library - History Database")
	fmt.Println("Server is listening on localhost:8080")
	fmt.Println("Successfuly connected to Database")
	fmt.Println("Close this window or enter Ctrl+C to quit")

	router := gin.Default()
	router.GET("/records", getRecords)
	router.GET("/records/:id", getRecordByID)
	router.Run("localhost:8080")
}

func allHistoryRecords(offset int) ([]HistoryRecord, error) {
	var records []HistoryRecord

	rows, err := db.Query(`
  SELECT id, date, title
  FROM history_record
  WHERE deleted_at IS NULL
    AND record_status_id = 3
  ORDER BY date(date), title ASC
  LIMIT 50
  OFFSET ?
  ;`, offset)

	if err != nil {
		return nil, fmt.Errorf("allHistoryRecords: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var record HistoryRecord
		if err := rows.Scan(&record.ID, &record.Date, &record.Title); err != nil {
			return nil, fmt.Errorf("allHistoryRecords: %v", err)
		}
		records = append(records, record)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("allHistoryRecords: %v", err)
	}

	return records, nil
}

func publishedHistoryRecords(offset int) ([]HistoryRecord, error) {

	var records []HistoryRecord

	rows, err := db.Query(`
  SELECT
    history_record.id,
    history_record.date,
    history_record.title,
    history_record.content,
    history_record.origin,
    history_record.author,
    source_archive.name,
    attachment_type_name,
    file_name,
    record_type.name,
    (SELECT GROUP_CONCAT(collection.name, ';')
     FROM history_record hr
     LEFT OUTER JOIN record_collections ON hr.id = record_collections.record_id
     LEFT OUTER JOIN collection ON record_collections.collection_id = collection.id
     WHERE history_record.id = hr.id) AS collections  
  FROM history_record
  LEFT OUTER JOIN (
    SELECT record_id as file_attachment_record_id, file_name, attachment_type.name as attachment_type_name
    FROM file_attachment
    INNER JOIN attachment_type
    ON attachment_type.id = attachment_type_id
    ) ON history_record.id = file_attachment_record_id
  LEFT OUTER JOIN record_type ON history_record.record_type_id = record_type.id
  LEFT OUTER JOIN source_archive ON history_record.source_archive_id = source_archive.id
  WHERE record_status_id = 3
  AND deleted_at IS NULL
  ORDER BY date(history_record.date), history_record.title
  LIMIT 50 OFFSET 0
  `, offset)

	if err != nil {
		return nil, fmt.Errorf("publishedHistoryRecords: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var record HistoryRecord
		err := rows.Scan(
			&record.ID,
			&record.Date,
			&record.Title,
			&record.Content,
			&record.Origin,
			&record.Author,
			&record.SourceArchive,
			&record.AttachmentType,
			&record.FileName,
			&record.RecordType,
      &record.Collections)
		if err != nil {
			return nil, fmt.Errorf("publishedHistoryRecords: %v", err)
		}
		records = append(records, record)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("publishedHistoryRecords: %v", err)
	}

	return records, nil
}

func historyRecordByID(id int64) (HistoryRecord, error) {
	var record HistoryRecord

	row := db.QueryRow(`
  SELECT
    history_record.id,
    history_record.date,
    history_record.title,
    history_record.content,
    history_record.origin,
    history_record.author,
    source_archive.name,
    attachment_type_name,
    file_name,
    record_type.name, 
    GROUP_CONCAT(collection.name, ';') AS collections
  FROM history_record
  LEFT OUTER JOIN record_collections ON record_collections.record_id = history_record.id
  LEFT OUTER JOIN collection ON record_collections.collection_id = collection.id
  LEFT OUTER JOIN (
    SELECT record_id as file_attachment_record_id, file_name, attachment_type.name as attachment_type_name
    FROM file_attachment
    INNER JOIN attachment_type
    ON attachment_type.id = attachment_type_id
  ) ON history_record.id = file_attachment_record_id
  LEFT OUTER JOIN record_type ON history_record.id = record_type.id
  LEFT OUTER JOIN source_archive ON history_record.source_archive_id = source_archive.id
  WHERE record_status_id = 3
  AND deleted_at IS NULL
  AND history_record.id = ?;
  `, id)

	err := row.Scan(&record.ID, &record.Date, &record.Title, &record.Content, &record.Origin,
		&record.Author, &record.SourceArchive, &record.AttachmentType, &record.FileName, &record.RecordType,
		&record.Collections)

	if err != nil {
		if err == sql.ErrNoRows {
			return record, fmt.Errorf("historyRecordById %d: no such record", id)
		}
		return record, fmt.Errorf("historyRecordById %d: %v", id, err)
	}
	return record, nil
}
