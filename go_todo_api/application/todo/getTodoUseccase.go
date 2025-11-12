package todo

import (
	"time"
	"todo-app-go/domain/entity"
	"todo-app-go/domain/repository"
	value_object "todo-app-go/domain/value-object"
)

type GetTodoUsecase struct {
	TodoRepo repository.ITodoRepository
}

func NewGetTodoUsecase(todoRepo repository.ITodoRepository) *GetTodoUsecase {
	return &GetTodoUsecase{
		TodoRepo: todoRepo,
	}
}

func (uc *GetTodoUsecase) Execute(
	userID value_object.UserID,
	title string,
	body string,
	dueDateFrom *time.Time,
	dueDateTo *time.Time,
	completed *bool,
) ([]entity.Todos, error) {
	// フィルタを作成
	filters := repository.TodoFilters{
		Title: title,
		Body:  body,
	}
	// DueDate の範囲指定があれば設定
	if dueDateFrom != nil {
		filters.DueDateFrom = *dueDateFrom
	}
	if dueDateTo != nil {
		filters.DueDateTo = *dueDateTo
	}
	// Completed の指定があれば設定
	filters.Completed = completed

	// リポジトリのメソッドを呼び出す
	return uc.TodoRepo.FindAll(userID, filters)
}
