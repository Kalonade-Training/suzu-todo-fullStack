package todo

import (
	"fmt"
	"todo-app-go/domain/entity"
	"todo-app-go/domain/repository"
	value_object "todo-app-go/domain/vo"
)

type GetDetailTodoUsecase struct {
	TodoRepo repository.ITodoRepository
}

func NewGetDetailTodoUsecase(todoRepo repository.ITodoRepository) *GetDetailTodoUsecase {
	return &GetDetailTodoUsecase{
		TodoRepo: todoRepo,
	}
}

func (u *GetDetailTodoUsecase) GetDetail(todoID value_object.TodoID) (*entity.Todos, error) {
	todo, err := u.TodoRepo.FindById(todoID)
	if err != nil {
		return nil, fmt.Errorf("タスクの詳細を取得できませんでした: %w", err)
	}
	return todo, nil
}
