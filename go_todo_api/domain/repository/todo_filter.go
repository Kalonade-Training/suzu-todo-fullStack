package repository

import "time"

type TodoFilters struct {
	Title       string
	Body        string
	DueDateFrom time.Time
	DueDateTo   time.Time
	Completed   *bool
}
