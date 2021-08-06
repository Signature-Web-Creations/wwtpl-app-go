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

This project uses [go-sqlite3](github.com/mattn/go-sqlite3) as a database driver. This is a cgo package
so it needs to be compiled:
* Install with `go get .`
* `export CGO_ENABLED=1`
* Have gcc installed and on the path (Need to download gcc for windows)  

Development Notes:
Because history records will be represented by a struct, it is important to get
the database tables correct before writing code to access the database. So, the 
next priority will be doing that. 
