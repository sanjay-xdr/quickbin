package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
)

func main() {

	//add gorilla mux

	//add routes

	// add handlers
	dbConnectionString := os.Getenv("DB_CONNECTION_STRING")

	db, err := sql.Open("postgres", dbConnectionString)

	if err != nil {
		log.Fatal("Cannot connect to DB:", err)
	}
	defer db.Close()
	//start the server
	app := &Config{DB: db}

	app.serve()

}

func (app *Config) serve() {
	srv := &http.Server{
		Addr:    ":8080",
		Handler: app.Routes(),
	}

	log.Println("Starting the Server....")
	err := srv.ListenAndServe()
	if err != nil {

		log.Println("Something went wrong while running the server ", err)
	}
}
