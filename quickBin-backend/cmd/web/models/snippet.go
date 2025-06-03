package models

import "time"

type Snippet struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	ExpiresAt time.Time `json:"expires_at"`
}

type SnippetRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Expiry  string `json:"expiry"` // e.g., "10m", "1h", "1d"
}
