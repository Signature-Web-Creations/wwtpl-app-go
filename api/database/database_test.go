package database

import (
	"testing"

	"example.com/wwtl-app/models"
)

func TestAdminListing(t *testing.T) {
	Connect("test.db") 

	user := models.User{
		ID: 0,
	}

	record := models.HistoryRecordForm{
		Date: "2020-01-01",
		Title: "Test Record",
		SourceArchiveID: 1,
		RecordStatusID: 3,
		RecordTypeID: 1,
		Collections: []int64{1}, 
	}

	recordId, err := InsertRecord(user, record) 

	if err != nil {
		t.Errorf("TestAdminListing Failed to create test record.")
		t.Errorf("\tError: %v", err)
		return
	}

	params := make(map[string]interface{})

	params["offset"] = 0
	params["query"] = ""
	params["year"] = ""
	params["recordType"] = ""
	params["sourceArchive"] = ""
	params["collection"] = "" 
	params["recordStatus"] = ""

	records, _, err := AdminListings(params)

	if len(records) == 0 {
		t.Errorf("TestAdminListing - records should have been returned")
		t.Errorf("\terr: %v", err)
		return
	}

	if records[0].ID != recordId {
		t.Errorf("TestAdminListing - first record should be the most recent record created")
		t.Errorf("\tgot: %d", records[0].ID)
		t.Errorf("\twant: %d", recordId)

		return
	}

	err = DeleteRecord(recordId)
	if err != nil {
		t.Errorf("TestAdminListing - failed to delete record")
		t.Errorf("\terr: %v", err)
		return
	}

	records, _, _ = AdminListings(params)
	if records[0].ID != recordId {
		t.Errorf("TestAdminListing - first record should still be the most recent record created")
		t.Errorf("\tgot: %d", records[0].ID)
		t.Errorf("\twant: %d", recordId)
		return
	}
}
