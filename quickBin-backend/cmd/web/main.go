package main

import (
	"database/sql"
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

func main() {

	//add gorilla mux

	//add routes

	// add handlers
	db, err := sql.Open("postgres", "postgresql://quickcode_owner:npg_DTbW4lvwk6Gz@ep-square-rain-a8rb2c3q-pooler.eastus2.azure.neon.tech/quickcode?sslmode=require")

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
