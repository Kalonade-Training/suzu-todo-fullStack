package repository

import (
	"todo-app-go/domain/entity"
	value_object "todo-app-go/domain/vo"
)

// Todoエンティティのリポジトリインターフェースを定義
type ITodoRepository interface {
	Create(todo *entity.Todos) error
	Update(todo *entity.Todos) error
	Delete(todoID value_object.TodoID) error
	FindAll(userID value_object.UserID, filters TodoFilters) ([]entity.Todos, error)
	FindById(todoID value_object.TodoID) (*entity.Todos, error)
	// FindByUserID(userID value_object.UserID) ([]entity.Todos, error)
}
