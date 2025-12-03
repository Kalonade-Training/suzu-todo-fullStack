package todo

import (
	"fmt"
	"time"
	"todo-app-go/domain/entity"
	"todo-app-go/domain/repository"
	value_object "todo-app-go/domain/value-object"
)

type UpdateTodoUsecase struct {
	repo repository.ITodoRepository
}

func NewUpdateTodoUsecase(repo repository.ITodoRepository) *UpdateTodoUsecase {
	return &UpdateTodoUsecase{repo: repo}
}

func (uc *UpdateTodoUsecase) Update(
	todoID value_object.TodoID,
	title string,
	body string,
	dueDate *time.Time,
	completed bool,
) error {
	// 修正：まず既存のTodoを取得
	existingTodo, err := uc.repo.FindById(todoID)
	if err != nil {
		return fmt.Errorf("failed to find todo: %w", err)
	}
	// value_object を作る
	titleVO, err := value_object.FromStringTitle(title)
	if err != nil {
		return err
	}
	bodyVO, err := value_object.FromStringBody(body)
	if err != nil {
		return err
	}
	// DueDate VO のポインタ
	var dueDatePtr *value_object.DueDate

	// dueDate が nil でない場合のみ VO を生成
	if dueDate != nil {
		dueDateVO, err := value_object.FromTimeDueDate(*dueDate)
		if err != nil {
			return err
		}
		dueDatePtr = &dueDateVO
	}

	isCompletedVO := value_object.NewIsCompleted(completed)

	// entity のコンストラクタで Todo を作る
	todo := entity.NewTodo(
		todoID,
		existingTodo.UserID(), // UserID は更新しないので既存の値を使用
		titleVO,
		bodyVO,
		dueDatePtr, // DueDate があれば設定
		isCompletedVO,
		existingTodo.CreatedAt(), // CreatedAtも既存の値を利用
		time.Now(),               // UpdatedAt
	)

	// リポジトリの メソッドを呼び出す
	return uc.repo.Update(&todo)
}
