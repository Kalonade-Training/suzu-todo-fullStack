package todo

import (
	"fmt"
	"todo-app-go/domain/entity"
	"todo-app-go/domain/repository"
	value_object "todo-app-go/domain/value-object"
)

type DuplicateTodoUsecase struct {
	repo repository.ITodoRepository
}

func NewDuplicateTodoUsecase(repo repository.ITodoRepository) *DuplicateTodoUsecase {
	return &DuplicateTodoUsecase{repo: repo}
}

func (u *DuplicateTodoUsecase) Duplicate(originalTodoID value_object.TodoID) error {
	// 元のTODOを取得
	originalTodo, err := u.repo.FindById(originalTodoID)
	if err != nil {
		return fmt.Errorf("failed to find original todo: %w", err)
	}
	// 複製するTODOエンティティを作成
	duplicatedTodo := entity.NewTodo(
		value_object.NewTodoID(),
		originalTodo.UserID(),
		originalTodo.Title(),
		originalTodo.Body(),
		originalTodo.DueDate(),
		originalTodo.IsCompleted(),
		originalTodo.CreatedAt(),
		originalTodo.UpdatedAt(),
	)
	// 複製したTODOを保存
	return u.repo.Create(&duplicatedTodo)
}
