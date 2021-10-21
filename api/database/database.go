package database

import (
	"database/sql"
	"fmt"
	"log"
	"strconv"

	"example.com/wwtl-app/models"

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
		source_archive.id,
    source_archive.name,
    attachment_type_name,
    file_name,
		record_type.id,
    record_type.name,
		record_status.id,
		record_status.name,
    (SELECT GROUP_CONCAT(collection.name, ';')
     FROM history_record hr
     LEFT OUTER JOIN record_collections ON hr.id = record_collections.record_id
     LEFT OUTER JOIN collection ON record_collections.collection_id = collection.id
     WHERE history_record.id = hr.id) AS collections,
		history_record.deleted_at
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

func Connect(filename string) {
	dsn := fmt.Sprintf("file:%s", filename)

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

func addFilters(query sq.SelectBuilder, params map[string]interface{}) sq.SelectBuilder {
	if params == nil {
		return query
	}

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
		if recordType, err := strconv.Atoi(params["recordType"].(string)); err == nil {
			query = query.Where(`history_record.record_type_id = ?`, recordType)
		}
	}

	if params["sourceArchive"] != "" {
		if sourceArchive, err := strconv.Atoi(params["sourceArchive"].(string)); err == nil {
			query = query.Where(`history_record.source_archive_id = ?`, sourceArchive)
		}
	}

	if params["collection"] != "" {
		query = query.Where(`? IN (SELECT collection_id FROM record_collections WHERE record_id = history_record.id)`, params["collection"])
	}

	if params["recordStatus"] != "" {
		if recordStatus, err := strconv.Atoi(params["recordStatus"].(string)); err == nil {
			query = query.Where(`history_record.record_status_id = ?`, recordStatus)
		}
	}

	return query
}

func rowToRecord(row sq.RowScanner) (models.HistoryRecord, error) {
	var record models.HistoryRecord

	var sourceArchiveID *int64
	var sourceArchive *string

	var recordTypeID *int64
	var recordType *string

	var recordStatusID *int64
	var recordStatus *string 

	var deletedAt *string

	err := row.Scan(
		&record.ID,
		&record.Date,
		&record.Title,
		&record.Content,
		&record.Origin,
		&record.Author,
		&sourceArchiveID,
		&sourceArchive,
		&record.AttachmentType,
		&record.Filename,
		&recordTypeID,
		&recordType,
		&recordStatusID,
		&recordStatus,
		&record.Collections,
		&deletedAt,
	)

	if err != nil {
		return record, fmt.Errorf("rowToRecord: %v", err)
	}

	if sourceArchiveID != nil {
		record.SourceArchive = &models.SourceArchive{
			ID: *sourceArchiveID,
			Name: *sourceArchive,
		}
	}

	if recordStatusID != nil {
		record.RecordStatus = &models.RecordStatus{
			ID: *recordStatusID,
			Name: *recordStatus,
		}
	}

	if recordTypeID != nil {
		record.RecordType = &models.RecordType{
			ID: *recordTypeID, 
			Name: *recordType,
		}
	}

	record.Deleted = deletedAt != nil
	return record, nil
}
// Executes query either returning a single HistoryRecord or an error
// functionName is given for error reporting
func queryRecord(functionName string, query sq.SelectBuilder) (models.HistoryRecord, error) {
	return rowToRecord(query.RunWith(db).QueryRow())
}

// Executes query either returning a slice of HistoryRecords or an error
// functionName is given for error reporting
func queryRecords(functionName string, query sq.SelectBuilder) ([]models.HistoryRecord, error) {
	var records []models.HistoryRecord
	rows, err := query.RunWith(db).Query()

	if err != nil {
		return nil, fmt.Errorf("%s: %v", functionName, err)
	}

	defer rows.Close()

	for rows.Next() {
		record, err := rowToRecord(rows)
		if err != nil {
			return nil, fmt.Errorf("%s: %v", functionName, err)
		}
		records = append(records, record)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("%s: %v", functionName, err)
	}

	return records, nil
}

// Returns listings for an editor
// It should only include records that were created by the editor
// and have a record status of 1 (saved but not submitted)
func EditorListings(user models.User, params map[string]interface{}) ([]models.HistoryRecord, int, error) {
	query := historyRecords
	query = query.Where(sq.Eq{"created_by": user.ID})
	query = query.Where(sq.Eq{"record_status_id": 1})
	query = query.Where(sq.Eq{"deleted_at": nil})
	query = query.OrderBy("date(history_record.date_entered) DESC", "history_record.title")
	query = addFilters(query, params)
	query = query.Limit(uint64(recordsPerPage))
	query = query.Offset(uint64(params["offset"].(int)) * recordsPerPage)

	records, err := queryRecords("EditorListings", query)

	query = sq.Select("COUNT(*)").From("history_record")
	query = query.Where(sq.Eq{"created_by": user.ID})
	query = query.Where(sq.Eq{"record_status_id": 1})
	query = query.Where(sq.Eq{"deleted_at": nil})
	query = addFilters(query, params)

	pages, err := runCountQuery(query)

	if err != nil {
		return nil, 0, err
	}

	return records, pages, nil
}

// Returns listings for a publisher
func PublisherListings(user models.User, params map[string]interface{}) ([]models.HistoryRecord, int, error) {
	query := historyRecords
	query = addFilters(query, params)
	query = query.Where(sq.Eq{"deleted_at": nil})
	query = query.Where(
		sq.Or{
			sq.Eq{"record_status_id": 1, "created_by": user.ID}, // Saved and created by the publisher
			sq.Eq{"record_status_id": 2}, // Created and pending approval
			sq.Eq{"record_status_id": 3}, // Created and published
			sq.Eq{"record_status_id": 4}, // Created and unpublished
		},
	)

	query = query.OrderBy("date(history_record.date_entered) DESC", "history_record.title")
	query = query.Limit(uint64(recordsPerPage))
	query = query.Offset(uint64(params["offset"].(int)) * recordsPerPage)

	records, err := queryRecords("PublisherListings", query)
	if err != nil {
		return nil, 0, err
	}


	query = sq.Select("COUNT(*)").From("history_record")
	query = addFilters(query, params)
	query = query.Where(sq.Eq{"deleted_at": nil})
	query = query.Where(
		sq.Or{
			sq.Eq{"record_status_id": 1, "created_by": user.ID}, // Saved and created by the publisher
			sq.Eq{"record_status_id": 2}, // Created and pending approval
			sq.Eq{"record_status_id": 3}, // Created and published
			sq.Eq{"record_status_id": 4}, // Created and unpublished
		},
	)
	pages, err := runCountQuery(query)

	if err != nil {
		return nil, 0, err
	}

	return records, pages, nil
}

// Returns listings for an admin
func AdminListings(params map[string]interface{}) ([]models.HistoryRecord, int, error) {
	query := historyRecords
	query = addFilters(query, params)
	query = query.OrderBy("date(history_record.date_entered) DESC", "history_record.id desc", "history_record.title")
	query = query.Limit(uint64(recordsPerPage))
	query = query.Offset(uint64(params["offset"].(int)) * recordsPerPage)

	records, err := queryRecords("AdminListings", query)
	if err != nil {
		return nil, 0, err
	}

	pages, err := CountPages(params)
	if err != nil {
		return nil, 0, err
	}

	return records, pages, nil
}


// Returns published history records that are not deleted.
// filters the result based on given parameters
func PublishedHistoryRecords(params map[string]interface{}) ([]models.HistoryRecord, error) {
	query := addFilters(PublishedRecords(), params)
	query = query.OrderBy("date(history_record.date)").OrderBy("history_record.title")
	query = query.Limit(uint64(recordsPerPage))
	query = query.Offset(uint64(params["offset"].(int)) * recordsPerPage)
	return queryRecords("PublishedHistoryRecords", query)
}

// Returns a HistoryRecord detail
// Used in the admin interface
func GetRecordDetail(id int64) (models.HistoryRecord, error) {
	query := historyRecords.Where("history_record.id = ?", id)
	return queryRecord("GetRecordDetail", query)
}

// Returns HistoryRecord detail
// History Record must be published and not deleted
func HistoryRecordByID(id int64) (models.HistoryRecord, error) {
	query := PublishedRecords().Where(sq.Eq{`history_record.id`: id})
	return queryRecord(fmt.Sprintf("HistoryRecordByID: %d", id), query)
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

func runCountQuery(query sq.SelectBuilder) (int, error) {
	var pages int

	row := query.RunWith(db).QueryRow()
	err := row.Scan(&pages)

	if err != nil {
		return 0, err
	}

	return pages / recordsPerPage, nil
}
// Counts pages
func CountPages(params map[string]interface{}) (int, error) {
	query := sq.Select("COUNT(*)").From("history_record")
	query = addFilters(query, params)

	return runCountQuery(query)
}


// Counts records that are published not deleted and
// are not filtered by given params
func CountPublishedPages(params map[string]interface{}) (int, error) {
	query := sq.Select("COUNT(*)").From("history_record")
	query = query.Where(sq.Eq{"deleted_at": nil})
	query = query.Where(sq.Eq{"record_status_id": 3})
	query = addFilters(query, params)
	return runCountQuery(query)
}

type CollectionInfo struct {
	Collections    []models.Collection     `json:"collections"`
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
		var collection models.Collection
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


func GetSourceArchives() ([]models.SourceArchive, error) {
	var sourceArchives []models.SourceArchive

	query := sq.Select("id, name").From("source_archive")
	rows, err := query.RunWith(db).Query()

	if err != nil {
		return nil, fmt.Errorf("GetSourceArchives: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var sourceArchive models.SourceArchive
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

func GetRecordTypes() ([]models.RecordType, error) {
	var recordTypes []models.RecordType

	query := sq.Select("id, name").From("record_type")
	rows, err := query.RunWith(db).Query()

	if err != nil {
		return nil, fmt.Errorf("GetRecordTypes: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var recordType models.RecordType
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

func GetRecordStatuses() ([]models.RecordStatus, error) {
	var recordStatuses []models.RecordStatus

	query := sq.Select("id, name").From("record_status")
	rows, err := query.RunWith(db).Query()

	if err != nil {
		return nil, fmt.Errorf("GetRecordStatuses: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var recordStatus models.RecordStatus
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

func CreateUser(user models.NewUser) error {
	query := sq.Insert("user").Columns("firstName", "lastName", "username", "password", "role_id")
	password, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	query = query.Values(user.FirstName, user.LastName, user.Username, password, user.RoleId)
	_, err := query.RunWith(db).Exec()
	if err != nil {
		return fmt.Errorf("CreateUser: %v", err)
	}
	return nil
}

func GetUserByUsername(username string) (models.User, error) {
	var user models.User

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

func GetUserByID(id int) (models.User, error) {
	var user models.User

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

func GetUsers() ([]models.User, error) {
	var users []models.User

	query := sq.Select("user.id, firstName, lastName, username, user_roles.name")
	query = query.From("user")
	query = query.InnerJoin("user_roles on user.role_id = user_roles.id")

	rows, err := query.RunWith(db).Query()

	if err != nil {
		return nil, fmt.Errorf("GetUsers: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var user models.User
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

func GetRoles() ([]models.UserRole, error) {
	var roles []models.UserRole

	query := sq.Select("id, name")
	query = query.From("user_roles")

	rows, err := query.RunWith(db).Query()

	if err != nil {
		return nil, fmt.Errorf("GetUsers: %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var role models.UserRole
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

// Inserts a history record
func InsertRecord(user models.User, record models.HistoryRecordForm) (int64, error) {

	tx, err := db.Begin()

	result, err := tx.Exec(`
	 INSERT INTO history_record
	 (title, content, date, origin, author, record_type_id, source_archive_id, entered_by, created_by, date_entered, record_status_id)
	 VALUES
	 (?, ?, ?, ?, ?, ?, ?, ?, ?, DATE('now'), ?)
	 `, record.Title, record.Content, record.Date, record.Origin, record.Author, record.RecordTypeID,
		record.SourceArchiveID, user.FirstName+" "+user.LastName, user.ID, record.RecordStatusID,
	)

	if err != nil {
		tx.Rollback()
		return 0, fmt.Errorf("Error inserting record: %v", err)
	}

	recordId, err := result.LastInsertId()

	query := sq.Insert("record_collections")
	query = query.Columns("record_id", "collection_id")
	for _, collectionId := range record.Collections {
		query = query.Values(recordId, collectionId)
	}


	sql, arguments, err := query.ToSql()
	if err != nil {
		tx.Rollback()
		return 0, fmt.Errorf("Error creating query for collections: %v", err)
	}

	_, err = tx.Exec(sql, arguments...)
	if err != nil {
		tx.Rollback()
		return 0, fmt.Errorf("Error inserting collections: %v", err)
	}

	if record.Attachment != nil {
		attachment := record.Attachment
		query = sq.Insert("file_attachment")
		query = query.Columns("record_id", "file_name", "attachment_type_id")
		query = query.Values(recordId, attachment.Filename, attachment.AttachmentTypeId)

		sql, arguments, err := query.ToSql()
		if err != nil {
			tx.Rollback()
			return 0, fmt.Errorf("Error creating query for file_attachment: %v", err)
		}

		_, err = tx.Exec(sql, arguments...)
		if err != nil {
			tx.Rollback()
			return 0, fmt.Errorf("Error saving file_attachment: %v", err)
		}
	}

	tx.Commit()
	return recordId, nil
}

func UpdateRecord(recordId int64, record models.HistoryRecordForm) error {
	tx, err := db.Begin()

	_, err = tx.Exec(`
	 DELETE FROM record_collections
	 WHERE record_id = ?
	`, recordId)

	if err != nil {
		tx.Rollback()
		return fmt.Errorf("Error deleting record_collections: %v", err)
	}

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

	// Updating fields in history record
	updateQuery := sq.Update("history_record").Where("id = ?", recordId)
	updateQuery = updateQuery.Set("title", record.Title)
	updateQuery = updateQuery.Set("date", record.Date)
	updateQuery = updateQuery.Set("content", record.Content)
	updateQuery = updateQuery.Set("origin", record.Origin)
	updateQuery = updateQuery.Set("author", record.Author)
	updateQuery = updateQuery.Set("record_type_id", record.RecordTypeID)
	updateQuery = updateQuery.Set("source_archive_id", record.SourceArchiveID)
	updateQuery = updateQuery.Set("record_status_id", record.RecordStatusID)

	sql, arguments, err = updateQuery.ToSql()
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("Error creating update query: %v", err)
	}

	_, err = tx.Exec(sql, arguments...)
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("Error updating history record: %v", err)
	}
	tx.Commit()
	return nil
}

func ChangeStatus(recordID int64, recordStatusID int64) error {
	query := sq.Update("history_record").Set("record_status_id", recordStatusID)
	query = query.Where("id = ?", recordID)
	_, err := query.RunWith(db).Exec()

	if err != nil {
		return fmt.Errorf("ChangeStatus: %v", err)
	}
	return nil
}

func DeleteRecord(recordID int64) error {
	query := sq.Update("history_record").Set("deleted_at", "date('now')")
	query = query.Where("id = ?", recordID)

	_, err := query.RunWith(db).Exec()
	
	if err != nil {
		return fmt.Errorf("DeleteRecord: %v", err)
	}
	return nil
}

func RestoreRecord(recordID int64) error {
	query := sq.Update("history_record").Set("deleted_at", nil)
	query = query.Where("id = ?", recordID)

	_, err := query.RunWith(db).Exec()
	
	if err != nil {
		return fmt.Errorf("DeleteRecord: %v", err)
	}
	return nil
}

