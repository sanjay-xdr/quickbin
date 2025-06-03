package repository

import (
	"context"
	"database/sql"
	"log"
	"quickbin/cmd/web/models"
	"time"
)

type SnippetRepository struct {
	DB *sql.DB
}

func NewSnippetRepository(db *sql.DB) *SnippetRepository {
	return &SnippetRepository{DB: db}
}

func (r *SnippetRepository) Insert(ctx context.Context, snippet *models.Snippet) error {

	query := "INSERT INTO snippets (title,content,expiresat) values ($1,$2,$3) RETURNING id"
	var snippetId string
	err := r.DB.QueryRowContext(ctx, query, snippet.Title, snippet.Content, snippet.ExpiresAt).Scan(&snippetId)
	if err != nil {
		return err
	}

	snippet.ID = snippetId

	return nil
}

func (r *SnippetRepository) GetAllSnippets(ctx context.Context, req *models.Snippet) ([]*models.Snippet, error) {
	return nil, nil
}

func (r *SnippetRepository) GetSnippetByID(ctx context.Context, snippetId string) (*models.Snippet, error) {
	query := "SELECT id, title, content, expiresat, createat FROM snippets WHERE id = $1"

	snippet := &models.Snippet{}

	err := r.DB.QueryRowContext(ctx, query, snippetId).Scan(&snippet.ID, &snippet.Title, &snippet.Content, &snippet.ExpiresAt, &snippet.CreatedAt)

	if err != nil {

		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, err
	}
	log.Println(snippet)

	if snippet.ExpiresAt.UTC().Before(time.Now().UTC()) {
		log.Println("This is expired")
		return nil, nil
	}
	return snippet, nil

}
