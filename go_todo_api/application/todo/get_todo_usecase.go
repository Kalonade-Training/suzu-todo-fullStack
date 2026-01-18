package todo

import (
	"time"
	"todo-app-go/domain/entity"
	"todo-app-go/domain/repository"
	vo "todo-app-go/domain/vo"
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
	userID vo.UserID,
	title *vo.Title,
	body *vo.Body,
	dueDateFrom *time.Time,
	dueDateTo *time.Time,
	completed *bool,
) ([]entity.Todos, error) {

	var titleStr *string
	if title != nil {
		v := title.Value()
		titleStr = &v
	}

	var bodyStr *string
	if body != nil {
		v := body.Value()
		bodyStr = &v
	}

	// フィルタを作成
	filters := repository.TodoFilters{
		Title:       titleStr,
		Body:        bodyStr,
		DueDateFrom: dueDateFrom, // そのまま渡す
		DueDateTo:   dueDateTo,   // そのまま渡す
		Completed:   completed,
	}

	// リポジトリのメソッドを呼び出す
	return uc.TodoRepo.FindAll(userID, filters)
}
