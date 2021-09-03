package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"html/template"
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
}

func getRecords(c *gin.Context) {
	records, err := publishedHistoryRecords()
	if err != nil {
		fmt.Printf("Error: %v", err)
		c.IndentedJSON(http.StatusOK, records)
	}
	c.IndentedJSON(http.StatusOK, records)
}

func recordHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Path[len("/record/"):])

	if err != nil {
		fmt.Fprintf(w, "Can't find record: %v", err)
	} else {
		record, err := historyRecordByID(int64(id))

		if err != nil {
			fmt.Fprintf(w, "Couldn't find record for: %d", id)
		} else {
			tmpl := template.Must(template.ParseFiles("templates/record.html"))
			fmt.Println("Rendering template")
			fmt.Println(record)
			tmpl.Execute(w, record)
		}
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

func publishedHistoryRecords() ([]HistoryRecord, error) {

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
    record_type.name
  FROM history_record
  LEFT OUTER JOIN (
    SELECT record_id, file_name, attachment_type.name as attachment_type_name
    FROM file_attachment
    INNER JOIN attachment_type
    ON attachment_type.id = attachment_type_id
  ) ON history_record.id = record_id
  LEFT OUTER JOIN record_type ON history_record.id = record_type.id
  LEFT OUTER JOIN source_archive ON history_record.source_archive_id = source_archive.id
  WHERE record_status_id = 3
   AND deleted_at IS NULL
  ORDER BY date(history_record.date), history_record.title
  LIMIT 50
  `)

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
			&record.RecordType)
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
  SELECT title 
  FROM history_record
  WHERE id=?`, id)

	err := row.Scan(&record.Title)
	record.ID = id

	if err != nil {
		if err == sql.ErrNoRows {
			return record, fmt.Errorf("historyRecordById %d: no such record", id)
		}
		return record, fmt.Errorf("historyRecordById %d: %v", id, err)
	}
	return record, nil
}
