package main

import (
	"os"
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"

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
		panic("env is not set to dev or prod")
	} else if env == "dev" {
		database.Connect("development.db")
	} else if env == "prod" {
		database.Connect("archive.db")
		gin.SetMode(gin.ReleaseMode)
	} else {
		panic("env is not set to dev or prod")
	}

	if (len(os.Args) == 1) {
		fmt.Println("Running Williamsport-Washington Township Public Library - History Database")
		fmt.Println("Close this window or enter Ctrl+C to quit")

		router := routes.Create()

		if env == "dev" {
			fmt.Println("Server is listening on localhost:8080")
			router.Run("localhost:8080")
		} else if env == "prod" {
			fmt.Println("Server is listening on 0.0.0.0:80")
			router.Run("0.0.0.0:80")
		}
	} else {
		if os.Args[1] == "createUser" {
			createUser()
		}
	}
}
