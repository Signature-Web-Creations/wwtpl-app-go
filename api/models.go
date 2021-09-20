package main

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

type RecordType struct {
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
