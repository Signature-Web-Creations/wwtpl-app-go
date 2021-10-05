package main

import (
	"database/sql"
	"fmt"
	"log"
	"regexp"
	"strconv"
	"strings"

	sq "github.com/Masterminds/squirrel"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB
var historyRecords sq.SelectBuilder

const recordsPerPage = 20

func init() {
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
		record_status.name,
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
	historyRecords = historyRecords.LeftJoin(`record_status ON history_record.record_status_id = record_status.id`)
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

	if params["recordStatus"] != "" {
		if recordStatus, err := strconv.Atoi(params["recordStatus"]); err == nil {
			query = query.Where(`history_record.record_status_id = ?`, recordStatus)
		}
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
			&record.RecordStatus,
			&record.Collections,
		)
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

// Returns a HistoryRecord detail
// Used in the admin interface
func GetRecordDetail(id int64) (HistoryRecord, error) {
	var record HistoryRecord
	row := historyRecords.Where("history_record.id = ?", id).RunWith(db).QueryRow()

	err := row.Scan(
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
		&record.RecordStatus,
		&record.Collections,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return record, fmt.Errorf("historyRecordById %d: no such record", id)
		}
		return record, fmt.Errorf("historyRecordById %d: %v", id, err)
	}
	return record, nil
}

// Returns HistoryRecord detail
// History Record must be published and not deleted
func HistoryRecordByID(id int64) (HistoryRecord, error) {
	var record HistoryRecord

	row := PublishedRecords().Where(sq.Eq{`history_record.id`: id}).RunWith(db).QueryRow()

	err := row.Scan(
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
		&record.RecordStatus,
		&record.Collections,
	)

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

type CollectionInfo struct {
	Collections    []Collection     `json:"collections"`
	CollectionToID map[string]int64 `json:"collectionToId"`
}

func GetCollections() (CollectionInfo, error) {
	var collectionInfo CollectionInfo
	collectionInfo.CollectionToID = make(map[string]int64)

	query := sq.Select("id, name").From("collection")
	rows, err := query.RunWith(db).Query()

	if err != nil {
		return collectionInfo, fmt.Errorf("GetCollections: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var collection Collection
		err := rows.Scan(
			&collection.ID,
			&collection.Name)

		if err != nil {
			return collectionInfo, fmt.Errorf("GetCollections: %v", err)
		}
		collectionInfo.Collections = append(collectionInfo.Collections, collection)
		collectionInfo.CollectionToID[collection.Name] = collection.ID
	}

	if err := rows.Err(); err != nil {
		return collectionInfo, fmt.Errorf("GetCollections: %v", err)
	}

	return collectionInfo, nil
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

func GetRecordStatuses() ([]RecordStatus, error) {
	var recordStatuses []RecordStatus

	query := sq.Select("id, name").From("record_status")
	rows, err := query.RunWith(db).Query()

	if err != nil {
		return nil, fmt.Errorf("GetRecordStatuses: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var recordStatus RecordStatus
		err := rows.Scan(
			&recordStatus.ID,
			&recordStatus.Name)

		if err != nil {
			return nil, fmt.Errorf("GetRecordStatuses: %v", err)
		}
		recordStatuses = append(recordStatuses, recordStatus)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("GetRecordStatuses: %v", err)
	}

	return recordStatuses, nil
}

// Users

func CreateUser(user NewUser) error {
	query := sq.Insert("user").Columns("firstName", "lastName", "username", "password", "role_id")
	password, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	query = query.Values(user.FirstName, user.LastName, user.Username, password, user.RoleId)
	_, err := query.RunWith(db).Exec()
	if err != nil {
		return fmt.Errorf("CreateUser: %v", err)
	}
	return nil
}

func GetUserByUsername(username string) (User, error) {
	var user User

	query := sq.Select("user.id, firstName, lastName, username, password, active, user_roles.name")
	query = query.From("user")
	query = query.InnerJoin("user_roles on user.role_id = user_roles.id")
	query = query.Where("username = ?", username)

	row := query.RunWith(db).QueryRow()
	err := row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Username, &user.Password, &user.Active, &user.Role)

	if err != nil {
		if err == sql.ErrNoRows {
			return user, fmt.Errorf("GetUserByUsername: no user with username '%s'", username)
		}
		return user, fmt.Errorf("GetUserByUsername %s: %v", username, err)
	}

	return user, nil
}

func GetUserByID(id int) (User, error) {
	var user User

	query := sq.Select("user.id, firstName, lastName, username, password, user_roles.name")
	query = query.From("user")
	query = query.InnerJoin("user_roles on user.role_id = user_roles.id")
	query = query.Where("user.id = ?", id)

	row := query.RunWith(db).QueryRow()
	err := row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Username, &user.Password, &user.Role)

	if err != nil {
		if err == sql.ErrNoRows {
			return user, fmt.Errorf("GetUserByID: no user with username '%d'", id)
		}
		return user, fmt.Errorf("GetUserByID %d: %v", id, err)
	}

	return user, nil
}

func GetUsers() ([]User, error) {
	var users []User

	query := sq.Select("user.id, firstName, lastName, username, user_roles.name")
	query = query.From("user")
	query = query.InnerJoin("user_roles on user.role_id = user_roles.id")

	rows, err := query.RunWith(db).Query()

	if err != nil {
		return nil, fmt.Errorf("GetUsers: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var user User
		err := rows.Scan(
			&user.ID,
			&user.FirstName,
			&user.LastName,
			&user.Username,
			&user.Role,
		)

		if err != nil {
			return nil, fmt.Errorf("GetUsers: %v", err)
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("GetUsers: %v", err)
	}

	return users, nil
}

func GetRoles() ([]UserRole, error) {
	var roles []UserRole

	query := sq.Select("id, name")
	query = query.From("user_roles")

	rows, err := query.RunWith(db).Query()

	if err != nil {
		return nil, fmt.Errorf("GetUsers: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var role UserRole
		err := rows.Scan(
			&role.ID,
			&role.Name,
		)

		if err != nil {
			return nil, fmt.Errorf("GetRoles: %v", err)
		}
		roles = append(roles, role)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("GetRoles: %v", err)
	}

	return roles, nil
}

// Updates a user with given userId
func UpdateUser(userId int64, fields map[string]interface{}) error {
	query := sq.Update("user")
	for field, value := range fields {
		query = query.Set(field, value)
	}
	query = query.Where("id = ?", userId)
	_, err := query.RunWith(db).Exec()

	if err != nil {
		return fmt.Errorf("UpdateUser: %v", err)
	}
	return nil
}

type HistoryRecordJSON struct {
	ID              int64   `json:"id"`
	Date            string  `json:"date"`
	Title           string  `json:"title"`
	Content         string  `json:"content"`
	Origin          string  `json:"origin"`
	Author          string  `json:"author"`
	AttachmentType  *string `json:"attachmentType"`
	FileName        *string `json:"fileName"`
	RecordTypeId    int64   `json:"recordType"`
	SourceArchiveId int64   `json:"sourceArchive"`
	Collections     []int64 `json:"collections"`
}

// Formats a date either in the format yyyy or mm/dd/yyyy
// to yyyy-mm-dd. If only year is given month and day
// defaults to 01/01. If it couldn't not format the date
// returns error
func formatDate(dateStr string) (string, error) {
	date := regexp.MustCompile(`^\d{2}/\d{2}/\d{4}$`)
	yearOnly := regexp.MustCompile(`^\d{4}$`)

	if date.Match([]byte(dateStr)) {
		segments := strings.Split(dateStr, "/")
		month := segments[0]
		day := segments[1]
		year := segments[2]
		return (year + "-" + month + "-" + day), nil
	} else if yearOnly.Match([]byte(dateStr)) {
		return fmt.Sprintf("%s-01-01", dateStr), nil
	} else {
		return dateStr, fmt.Errorf("Cannot format date: %s", dateStr)
	}
}

// Inserts a history record
func InsertRecord(user User, record HistoryRecordJSON) error {
	date, err := formatDate(record.Date)
	if err != nil {
		return fmt.Errorf("InsertRecord: %v", err)
	}

	tx, err := db.Begin()

	result, err := tx.Exec(`
	 INSERT INTO history_record
	 (title, content, date, origin, author, record_type_id, source_archive_id, entered_by)
	 VALUES
	 (?, ?, ?, ?, ?, ?, ?, ?)
	 `, record.Title, record.Content, date, record.Origin, record.Author, record.RecordTypeId,
		record.SourceArchiveId, user.FirstName+" "+user.LastName,
	)

	if err != nil {
		tx.Rollback()
		return fmt.Errorf("Error inserting record: %v", err)
	}

	recordId, err := result.LastInsertId()
	fmt.Printf("RecordId: %d\n", recordId)

	query := sq.Insert("record_collections")
	query = query.Columns("record_id", "collection_id") 
	for _, collectionId := range record.Collections {
		query = query.Values(recordId, collectionId)
	}

	sql, arguments, err := query.ToSql()
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("Error creating query for collections: %v", err)
	}

	_, err = tx.Exec(sql, arguments...) 
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("Error inserting collections: %v", err)
	}

	tx.Commit()
	return nil
}
