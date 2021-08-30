Williamsport-Washington Library Archive Project

This project aims to create a simple web application for a library to create, edit, and publish
archives. The first iteration is to write *tracer-bullets* to check to make sure doing this
project is viable to be done in Go. 

Requirements:
* Able to create standalone executable that compiles and runs in a windows environment
* Able to access a standalone sqlite3 database (easy to access, easy to backup, no additional installation required)
* Able to save media files in a folder on the computer 
* Able to start a web server upon execution that listens on port 8080 or a predefined port 
* Able to serve html templates that received data from a database
* Able to create sessions to handle user authentication

Installation:

This project uses [go-sqlite3](https://github.com/mattn/go-sqlite3) as a database driver. This is a cgo package
so it needs to be compiled:
* Install with `go get .`
* `export CGO_ENABLED=1`
* Have gcc installed and on the path (Need to download gcc for windows)  

Development Notes:
Because history records will be represented by a struct, it is important to get
the database tables correct before writing code to access the database. So, the 
next priority will be doing that. 

To make sure that it compiles on Windows, development was moved from 
Ubuntu to Windows. GCC had to be installed [tdm-gcc](https://sourceforge.net/projects/tdm-gcc/) was used. The same would have to be installed on the target environment, 
but the if the target architecture is the same, it should work. 

GCC needs to be on the path and the environment variable 
CGO_ENABLED needs to be set to 1. In Windows this is done with 
`set CGO_ENABLED=1`. After that run `go build` to create an executable. 

The sqlite database has to be in the same folder. For deploying the app the 
plan is to create a zip file and download it onto the server. Double-clicking
the executable should be enough to get it to run

## Running the server
During development assuming that you have everything installed (go, go-sqlite3) 
switch to the api directory and run the server with `go run .` 

You can view an example page by visiting: localhost:8080/record/1 

## Maintainability

Since the database is a single file, we can backup the database by copying the file. 
The database should be backuped every week and stores for up to 5 weeks before 
it deletes the oldest backup 

## Source Archive and Collections

Source Archive is where the archive is physically located and stored.

One record can belong to multiple collections. 
But a record will only belong to one source archive. 

Every record should have at least one collection. 
That is a validation constraint more than an database one. 

There is a many to many relationship between Collections and Records. 

Admins need the ability to add collections. 
