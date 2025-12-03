package todo

import (
	"fmt"
	"time"
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
	// 修正：DueDate VO のポインタを準備
	var dueDateVO *value_object.DueDate = nil
	if originalTodo.DueDate() != nil {
		tmp := *originalTodo.DueDate() // 一旦値にする
		dueDateVO = &tmp
	}

	// 複製するTODOエンティティを作成
	duplicatedTodo := entity.NewTodo(
		value_object.NewTodoID(),
		originalTodo.UserID(),
		originalTodo.Title(),
		originalTodo.Body(),
		dueDateVO,
		value_object.NewIsCompleted(false), // 複製時は未完了に設定
		time.Now(),
		time.Now(),
	)
	// 複製したTODOを保存
	return u.repo.Create(&duplicatedTodo)
}
