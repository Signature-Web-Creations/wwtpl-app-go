package main

import (
	"fmt"
)

func main() {
	Connect()
	fmt.Println("Running Williamsport-Washington Township Public Library - History Database")
	fmt.Println("Server is listening on localhost:8080")
	fmt.Println("Successfuly connected to Database")
	fmt.Println("Close this window or enter Ctrl+C to quit")

	router := initRouter()
	router.Run("localhost:8080")
}
