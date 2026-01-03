package repository

import (
	"time"
)

// FindAllのフィルタリング条件をまとめた構造体
type TodoFilters struct {
	Title       *string
	Body        *string
	DueDateFrom *time.Time
	DueDateTo   *time.Time
	Completed   *bool
}
