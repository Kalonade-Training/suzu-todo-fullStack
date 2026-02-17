package entity

import (
	"time"
	value_object "todo-app-go/domain/vo"
)

type Todos struct {
	id          value_object.TodoID
	userID      value_object.UserID
	title       value_object.Title
	body        value_object.Body
	dueDate     *value_object.DueDate
	isCompleted value_object.IsCompleted
	createdAt   time.Time
	updatedAt   time.Time
}

func NewTodo(
	id value_object.TodoID,
	userID value_object.UserID,
	title value_object.Title,
	body value_object.Body,
	dueDate *value_object.DueDate,
	isCompleted value_object.IsCompleted,
	createdAt time.Time,
	updatedAt time.Time,
) Todos {
	return Todos{
		id:          id,
		userID:      userID,
		title:       title,
		body:        body,
		dueDate:     dueDate, //ポインタ型
		isCompleted: isCompleted,
		createdAt:   createdAt,
		updatedAt:   updatedAt,
	}
}

// getter関数
func (t Todos) ID() value_object.TodoID {
	return t.id
}
func (t Todos) UserID() value_object.UserID {
	return t.userID
}
func (t Todos) Title() value_object.Title {
	return t.title
}
func (t Todos) Body() value_object.Body {
	return t.body
}
func (t Todos) DueDate() *value_object.DueDate {
	return t.dueDate
}
func (t Todos) IsCompleted() value_object.IsCompleted {
	return t.isCompleted
}

func (t Todos) CreatedAt() time.Time {
	return t.createdAt
}
func (t Todos) UpdatedAt() time.Time {
	return t.updatedAt
}
