package models

type HistoryRecordForm struct {
	ID              int64   `json:"id"`
	Date            string  `json:"date"`
	Title           string  `json:"title"`
	Content         string  `json:"content"`
	Origin          string  `json:"origin"`
	Author          string  `json:"author"`
	AttachmentType  *string `json:"attachmentType"`
	FileName        *string `json:"fileName"`
	RecordTypeID    int64   `json:"recordType"`
	SourceArchiveID int64   `json:"sourceArchive"`
	Collections     []int64 `json:"collections"`
	RecordStatusID  int64   `json:"recordStatus"`
}

type HistoryRecord struct {
	ID             int64          `json:"id"`
	Date           string         `json:"date"`
	Title          string         `json:"title"`
	Content        string         `json:"content"`
	Origin         string         `json:"origin"`
	Author         string         `json:"author"`
	SourceArchive  *SourceArchive `json:"sourceArchive"`
	AttachmentType *string        `json:"attachmentType"`
	FileName       *string        `json:"fileName"`
	RecordType     *RecordType    `json:"recordType"`
	Collections    *string        `json:"collections"`
	RecordStatus   *RecordStatus  `json:"recordStatus"`
}

type RecordType struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type RecordStatus struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type SourceArchive struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type Collection struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

// Represents user roles
// Editors are the most restricted
// Admins have every permission
const (
	Anon = iota
	Editor
	Publisher
	Admin
)

type UserRole struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type User struct {
	ID        int64  `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Username  string `json:"username"`
	Password  []byte `json:"-"`
	Active    bool   `json:"active"`
	Role      string `json:"role"`
}

type NewUser struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Username  string `json:"username" binding:"required"`
	Password  string `json:"password" binding:"required"`
	RoleId    int64  `json:"roleId" binding:"required"`
}

func (u User) Authorized(userLevel int) bool {
	return (u.Role == "editor" && userLevel == 1) ||
		(u.Role == "publisher" && userLevel <= 2) ||
		(u.Role == "admin")
}
