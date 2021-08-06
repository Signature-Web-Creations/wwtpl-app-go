package main

import (
  "database/sql"
  "fmt"
  "log"

  _ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func main() {
  dsn := "file:test.db"

  var err error
  db, err = sql.Open("sqlite3", dsn)

  if err != nil {
    log.Fatal(err)
  }

  pingErr := db.Ping()
  if pingErr != nil {
    log.Fatal(pingErr)
  }

  fmt.Println("Connected")
}
