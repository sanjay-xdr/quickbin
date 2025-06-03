package main

import (
	"net/http"
	"quickbin/internals/handlers"
	"quickbin/internals/repository"

	"github.com/go-chi/chi/v5"
)

func (app *Config) Routes() http.Handler {

	mux := chi.NewRouter()
	repo := repository.NewSnippetRepository(app.DB)
	snippet := handlers.NewSnippetHandler(repo) // pass the repo
	mux.Get("/", func(w http.ResponseWriter, r *http.Request) {

		w.Write([]byte("Hello World"))
	})

	mux.Post("/snippets", snippet.CreateSnippetHandler)
	mux.Get("/snippets/{uuid}", snippet.GetSnippetByIDHandler)
	return mux
}
