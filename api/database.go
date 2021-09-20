package main

import (
	"database/sql"
	"fmt"
	sq "github.com/Masterminds/squirrel"
	_ "github.com/mattn/go-sqlite3"
	"log"
	"strconv"
)

var db *sql.DB
var historyRecords sq.SelectBuilder
var recordsPerPage int

func init() {
	recordsPerPage = 50
	historyRecords = sq.Select(`
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
  `).From(`history_record`)

	historyRecords = historyRecords.LeftJoin(`(
    SELECT record_id as file_attachment_record_id, file_name, attachment_type.name as attachment_type_name
    FROM file_attachment
    INNER JOIN attachment_type
    ON attachment_type.id = attachment_type_id
    ) ON history_record.id = file_attachment_record_id`)

	historyRecords = historyRecords.LeftJoin(`record_type ON history_record.record_type_id = record_type.id`)
	historyRecords = historyRecords.LeftJoin(`source_archive ON history_record.source_archive_id = source_archive.id`)
}

func Connect() {
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
}

func PublishedRecords() sq.SelectBuilder {
	return historyRecords.Where(sq.Eq{`record_status_id`: 3}).Where(
		sq.Eq{`deleted_at`: nil})
}

func addFilters(query sq.SelectBuilder, params map[string]string) sq.SelectBuilder {
	if params["query"] != "" {
		queryParam := fmt.Sprintf("%%%s%%", params["query"])
		query = query.Where(sq.Or{
			sq.Like{"history_record.title": queryParam},
			sq.Like{"history_record.content": queryParam}})
	}

	if params["year"] != "" {
		query = query.Where(`strftime('%Y', history_record.date) = ?`, params["year"])
	}

	if params["recordType"] != "" {
		if recordType, err := strconv.Atoi(params["recordType"]); err == nil {
			query = query.Where(`history_record.record_type_id = ?`, recordType)
		}
	}

	if params["sourceArchive"] != "" {
		if sourceArchive, err := strconv.Atoi(params["sourceArchive"]); err == nil {
			query = query.Where(`history_record.source_archive_id = ?`, sourceArchive)
		}
	}

	if params["collection"] != "" {
		query = query.Where(`? IN (SELECT collection_id FROM record_collections WHERE record_id = history_record.id)`, params["collection"])
	}

	return query
}

func PublishedHistoryRecords(offset int, params map[string]string) ([]HistoryRecord, error) {

	var records []HistoryRecord

	query := addFilters(PublishedRecords(), params)

	query = query.OrderBy("date(history_record.date)").OrderBy("history_record.title")
	query = query.Limit(uint64(recordsPerPage))
	query = query.Offset(uint64(offset * recordsPerPage))

	rows, err := query.RunWith(db).Query()

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

func HistoryRecordByID(id int64) (HistoryRecord, error) {
	var record HistoryRecord

	row := PublishedRecords().Where(sq.Eq{`history_record.id`: id}).RunWith(db).QueryRow()

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

func GetYears() ([]string, error) {
	var years []string
	rows, err := db.Query(
		`SELECT DISTINCT(strftime("%Y", date))
		 FROM history_record
		 ORDER BY strftime("%Y", date)
	`)

	if err != nil {
		return nil, fmt.Errorf("GetYears: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var year string
		err := rows.Scan(&year)
		if err != nil {
			return nil, fmt.Errorf("GetYears: %v", err)
		}
		years = append(years, year)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("GetYears: %v", err)
	}

	return years, nil
}

func CountPages(params map[string]string) (int, error) {
	var pages int

	query := sq.Select("COUNT(*)").From("history_record")
	query = query.Where(sq.Eq{"deleted_at": nil})
	query = query.Where(sq.Eq{"record_status_id": 3})
	query = addFilters(query, params)
	row := query.RunWith(db).QueryRow()
	err := row.Scan(&pages)

	if err != nil {
		return 0, err
	}

	return pages / recordsPerPage, nil
}

func GetCollections() ([]Collection, error) {
	var collections []Collection

	query := sq.Select("id, name").From("collection")
	rows, err := query.RunWith(db).Query()

	if err != nil {
		return nil, fmt.Errorf("GetCollections: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var collection Collection
		err := rows.Scan(
			&collection.ID,
			&collection.Name)

		if err != nil {
			return nil, fmt.Errorf("GetCollections: %v", err)
		}
		collections = append(collections, collection)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("GetCollections: %v", err)
	}

	return collections, nil
}

func GetSourceArchives() ([]SourceArchive, error) {
	var sourceArchives []SourceArchive

	query := sq.Select("id, name").From("source_archive")
	rows, err := query.RunWith(db).Query()

	if err != nil {
		return nil, fmt.Errorf("GetSourceArchives: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var sourceArchive SourceArchive
		err := rows.Scan(
			&sourceArchive.ID,
			&sourceArchive.Name)

		if err != nil {
			return nil, fmt.Errorf("GetSourceArchives: %v", err)
		}
		sourceArchives = append(sourceArchives, sourceArchive)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("GetSourceArchives: %v", err)
	}

	return sourceArchives, nil
}

func GetRecordTypes() ([]RecordType, error) {
	var recordTypes []RecordType

	query := sq.Select("id, name").From("record_type")
	rows, err := query.RunWith(db).Query()

	if err != nil {
		return nil, fmt.Errorf("GetRecordTypes: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var recordType RecordType
		err := rows.Scan(
			&recordType.ID,
			&recordType.Name)

		if err != nil {
			return nil, fmt.Errorf("GetRecordTypes: %v", err)
		}
		recordTypes = append(recordTypes, recordType)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("GetRecordTypes: %v", err)
	}

	return recordTypes, nil
}
