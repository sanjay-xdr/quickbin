package main

import (
	"net/http"
	"quickbin/internals/handlers"
	"quickbin/internals/repository"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func (app *Config) Routes() http.Handler {

	mux := chi.NewRouter()
	repo := repository.NewSnippetRepository(app.DB)
	snippet := handlers.NewSnippetHandler(repo) // pass the repo

	mux.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))
	mux.Get("/", func(w http.ResponseWriter, r *http.Request) {

		w.Write([]byte("Hello World"))
	})

	mux.Post("/snippets", snippet.CreateSnippetHandler)
	mux.Get("/snippets/{uuid}", snippet.GetSnippetByIDHandler)
	return mux
}
