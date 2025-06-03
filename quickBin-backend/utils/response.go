package utils

import (
	"encoding/json"
	"net/http"
	"quickbin/cmd/web/models"
)

func JSONResponse(w http.ResponseWriter, status int, success bool, message string, data interface{}) {
	response := &models.Response{
		Success: success,
		Status:  status,
		Message: message,
		Data:    data,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(response)
}
