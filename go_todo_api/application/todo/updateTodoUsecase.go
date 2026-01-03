package todo

import (
	"fmt"
	"time"
	"todo-app-go/domain/entity"
	"todo-app-go/domain/repository"
	vo "todo-app-go/domain/value-object"
)

type UpdateTodoUsecase struct {
	repo repository.ITodoRepository
}

func NewUpdateTodoUsecase(repo repository.ITodoRepository) *UpdateTodoUsecase {
	return &UpdateTodoUsecase{repo: repo}
}

func (uc *UpdateTodoUsecase) Update(
	todoID vo.TodoID,
	title vo.Title,
	body vo.Body,
	dueDate *vo.DueDate,
	completed vo.IsCompleted,
) error {
	// 修正：まず既存のTodoを取得
	existingTodo, err := uc.repo.FindById(todoID)
	if err != nil {
		return fmt.Errorf("タスクが見つかりません: %w", err)
	}
	// entity のコンストラクタで Todo を作る
	todo := entity.NewTodo(
		todoID,
		existingTodo.UserID(), // UserID は更新しないので既存の値を使用
		title,
		body,
		dueDate, // DueDate があれば設定
		completed,
		existingTodo.CreatedAt(), // CreatedAtも既存の値を利用
		time.Now(),               // UpdatedAt
	)

	// リポジトリの メソッドを呼び出す
	return uc.repo.Update(&todo)
}
