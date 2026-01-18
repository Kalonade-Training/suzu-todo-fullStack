package todo

import (
	"fmt"
	"time"
	"todo-app-go/domain/entity"
	"todo-app-go/domain/repository"
	vo "todo-app-go/domain/vo"
)

type CreateTodoUsecase struct {
	TodoRepo repository.ITodoRepository
}

func NewCreateTodoUsecase(todoRepo repository.ITodoRepository) *CreateTodoUsecase {
	return &CreateTodoUsecase{
		TodoRepo: todoRepo,
	}
}

func (u *CreateTodoUsecase) Execute(
	userID vo.UserID,
	title vo.Title,
	body vo.Body,
	dueDatePtr *vo.DueDate,
) (*entity.Todos, error) {
	titleValue := title.Value()
	// 重複タイトルチェック
	filters := repository.TodoFilters{
		Title: &titleValue,
	}

	existing, err := u.TodoRepo.FindAll(userID, filters)
	if err != nil {
		return nil, err
	}
	if len(existing) > 0 {
		return nil, fmt.Errorf("同じタイトルのタスクが既に存在します")
	}

	newTodo := entity.NewTodo(
		vo.NewTodoID(),
		userID,
		title,
		body,
		dueDatePtr, // pointer
		vo.NewIsCompleted(false),
		time.Now(),
		time.Now(),
	)
	// TodoRepo.Create がポインタを期待しているため、&newTodo を渡す
	err = u.TodoRepo.Create(&newTodo)
	if err != nil {
		return nil, err
	}

	return &newTodo, nil
}
