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

func historyRecordByID(id int64) (HistoryRecord, error) {
	var record HistoryRecord

	row := db.QueryRow(`
  SELECT title 
  FROM history_record
  WHERE id=?`, id)

	err := row.Scan(&record.Title);
  record.ID = id;

	if err != nil {
		if err == sql.ErrNoRows {
			return record, fmt.Errorf("historyRecordById %d: no such record", id)
		}
		return record, fmt.Errorf("historyRecordById %d: %v", id, err)
	}
	return record, nil
}
