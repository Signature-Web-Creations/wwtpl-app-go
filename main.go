package main

import (
	"database/sql"
	"fmt"
	_ "github.com/mattn/go-sqlite3"
	"html/template"
	"log"
	"net/http"
	"strconv"
)

var db *sql.DB

type HistoryRecord struct {
	ID             int64
	Title          string
	FileAttachment *string
	AttachmentType *string
	Content        string
	Date           string
	Origin         string
	Author         *string
	RecordType     *string
	SourceArchive  *string
	DateEntered    *string
	Collection     *string
	EnteredBy      string
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hi there, I love %s!", r.URL.Path[1:])

	record, err := historyRecordByID(1)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(record.Title)
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

	http.HandleFunc("/record/", recordHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func updateAttachmentType(attachment_type_id int64, attachment_type string) (bool, error) {
	_, err := db.Exec(
		"UPDATE history_record SET attachment_type_id=? WHERE attachment_type=?",
		attachment_type_id,
		attachment_type)

	if err != nil {
		return false, fmt.Errorf("updateAttachmentType: %v", err)
	}

	return true, nil
}

func historyRecordByID(id int64) (HistoryRecord, error) {
	var record HistoryRecord

	row := db.QueryRow(`
  SELECT title, file_attachment, attachment_type, content, date, origin, author, record_type, collection, entered_by
  FROM history_record
  WHERE id=?`, id)

	err := row.Scan(&record.Title, &record.FileAttachment, &record.AttachmentType, &record.Content, &record.Date,
		&record.Origin, &record.Author, &record.RecordType, &record.Collection, &record.EnteredBy)

	if err != nil {
		if err == sql.ErrNoRows {
			return record, fmt.Errorf("historyRecordById %d: no such record", id)
		}
		return record, fmt.Errorf("historyRecordById %d: %v", id, err)
	}
	return record, nil
}
