package handlers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"quickbin/cmd/web/models"
	"quickbin/internals/repository"
	"quickbin/utils"
	"time"

	"github.com/go-chi/chi/v5"
)

type SnippetHandler struct {
	Repo *repository.SnippetRepository
}

func NewSnippetHandler(repo *repository.SnippetRepository) *SnippetHandler {
	return &SnippetHandler{Repo: repo}
}

func (s *SnippetHandler) CreateSnippetHandler(w http.ResponseWriter, r *http.Request) {
	//read users input from body
	var snippetReq models.SnippetRequest
	err := json.NewDecoder(r.Body).Decode(&snippetReq)
	if err != nil {
		utils.JSONResponse(w, http.StatusBadRequest, false, "Invalid Request body", "")
		return
	}
	if snippetReq.Content == "" || snippetReq.Title == "" || snippetReq.Expiry == "" {
		utils.JSONResponse(w, http.StatusBadRequest, false, "Invalid Request body", "")
	}
	duration, err := parseExpiry(snippetReq.Expiry)
	if err != nil {
		utils.JSONResponse(w, http.StatusBadRequest, false, "Invalid Expiry time", "")
		return
	}

	snippet := &models.Snippet{
		Title:     snippetReq.Title,
		Content:   snippetReq.Content,
		ExpiresAt: time.Now().UTC().Add(duration),
	}

	//save it into db
	err = s.Repo.Insert(r.Context(), snippet)
	if err != nil {
		log.Print(err)
		utils.JSONResponse(w, http.StatusBadGateway, false, "something went wrong", "")
	}

	//send success and status code
	utils.JSONResponse(w, http.StatusOK, true, "snippet added successfully", snippet)
}

func (s *SnippetHandler) GetSnippetByIDHandler(w http.ResponseWriter, r *http.Request) {
	snippetId := chi.URLParam(r, "uuid")

	if snippetId == "" {
		utils.JSONResponse(w, http.StatusBadRequest, false, "please provide a valid url", "")
		return
	}

	data, err := s.Repo.GetSnippetByID(r.Context(), snippetId)

	if err != nil {
		log.Println(err)
		utils.JSONResponse(w, http.StatusBadRequest, false, "please provide a valid url", "")
	}
	if data == nil {
		utils.JSONResponse(w, http.StatusNotFound, true, "not found", "")
		return
	}

	utils.JSONResponse(w, http.StatusOK, true, "", data)

}

func parseExpiry(expiry string) (time.Duration, error) {
	switch expiry {
	case "10m":
		return 10 * time.Minute, nil
	case "1h":
		return time.Hour, nil
	case "1d":
		return 24 * time.Hour, nil
	case "7d":
		return 7 * 24 * time.Hour, nil
	case "30d":
		return 30 * 24 * time.Hour, nil
	default:
		return 0, errors.New("unsupported expiry value")
	}
}
