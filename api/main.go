package main

import (
	"os"
	"fmt"
	"strconv"

	"example.com/wwtl-app/models"
	"example.com/wwtl-app/database"
	"example.com/wwtl-app/routes"
)

func createUser() {
	var user models.NewUser 

	fmt.Printf("Enter first name. ")
	fmt.Scanln(&user.FirstName)
	fmt.Printf("Enter last name. ")
	fmt.Scanln(&user.LastName)
	fmt.Printf("Enter username. ")
	fmt.Scanln(&user.Username)
	fmt.Printf("Enter password. ")
	fmt.Scanln(&user.Password)


	var roleId string
	fmt.Printf("Enter a role (1 for editor, 2 for publisher, 3 for admin). ")
	fmt.Scanln(&roleId)
	role, err := strconv.ParseInt(roleId, 10, 64) 
	if err != nil {
		fmt.Println("Failed to get role id") 
		os.Exit(1)
	}
	user.RoleId = role

	if err = database.CreateUser(user); err != nil {
		fmt.Printf("Failed to create new user. %v\n", err)
		return 
	} 
	fmt.Println("Successfully created new user.")
}

func main() {
	env := os.Getenv("env") 
	if env == "" {
		panic("env is not defined.")
	} else if env == "dev" {
		fmt.Println("Using database development.db") 
		database.Connect("development.db")
	} else if env == "prod" {
		fmt.Println("Using database archive.db")
		database.Connect("archive.db")
	}

	if (len(os.Args) == 1) {
		fmt.Println("Running Williamsport-Washington Township Public Library - History Database")
		fmt.Println("Server is listening on localhost:8080")
		fmt.Println("Successfuly connected to Database")
		fmt.Println("Close this window or enter Ctrl+C to quit")

		router := routes.Create()
		router.Run("localhost:8080")
	} else {
		if os.Args[1] == "createUser" {
			createUser()
		}
	}
}
