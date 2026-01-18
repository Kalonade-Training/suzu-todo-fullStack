package todo

import (
	"fmt"
	"todo-app-go/domain/repository"
	value_object "todo-app-go/domain/vo"
)

type DeleteTodoUsecase struct {
	TodoRepo repository.ITodoRepository
}

func NewDeleteTodoUsecase(todoRepo repository.ITodoRepository) *DeleteTodoUsecase {
	return &DeleteTodoUsecase{
		TodoRepo: todoRepo,
	}
}

func (u *DeleteTodoUsecase) Delete(todoID value_object.TodoID) error {
	// まずは対象のTodoが存在するか確認
	existingTodo, err := u.TodoRepo.FindById(todoID)
	if err != nil {
		return err
	}
	if existingTodo == nil {
		return fmt.Errorf("タスクが存在しません")
	}
	// 存在する場合は削除を実行
	return u.TodoRepo.Delete(todoID)
}
