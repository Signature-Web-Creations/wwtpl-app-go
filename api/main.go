package main

import (
	"fmt"

	"example.com/wwtl-app/database"
	"example.com/wwtl-app/routes"
)

func main() {
	database.Connect("development.db")
	fmt.Println("Running Williamsport-Washington Township Public Library - History Database")
	fmt.Println("Server is listening on localhost:8080")
	fmt.Println("Successfuly connected to Database")
	fmt.Println("Close this window or enter Ctrl+C to quit")

	router := routes.Create()
	router.Run("localhost:8080")
}
