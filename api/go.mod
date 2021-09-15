module example.com/wwtl-app

go 1.16

require (
	example.com/database v0.0.0-00010101000000-000000000000
	github.com/gin-gonic/gin v1.7.4
	github.com/mattn/go-sqlite3 v1.14.8 // indirect
)

replace example.com/database => ./database
