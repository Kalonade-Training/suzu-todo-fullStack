package todo

import (
	"fmt"
	"time"
	"todo-app-go/domain/entity"
	"todo-app-go/domain/repository"
	vo "todo-app-go/domain/vo"
)

type DuplicateTodoUsecase struct {
	TodoRepo repository.ITodoRepository
}

func NewDuplicateTodoUsecase(todoRepo repository.ITodoRepository) *DuplicateTodoUsecase {
	return &DuplicateTodoUsecase{TodoRepo: todoRepo}
}

func (u *DuplicateTodoUsecase) Duplicate(originalTodoID vo.TodoID) error {
	// 元のTODOを取得
	originalTodo, err := u.TodoRepo.FindById(originalTodoID)
	if err != nil {
		return fmt.Errorf("元のタスクが見つかりません: %w", err)
	}
	// 修正：DueDate VO のポインタを準備
	// DueDate は nil を考慮してコピー
	var dueDate *vo.DueDate
	if originalTodo.DueDate() != nil {
		d := *originalTodo.DueDate()
		dueDate = &d
	}

	// 複製するTODOエンティティを作成
	duplicatedTodo := entity.NewTodo(
		vo.NewTodoID(),
		originalTodo.UserID(),
		originalTodo.Title(),
		originalTodo.Body(),
		dueDate,
		vo.NewIsCompleted(false), // 複製時は未完了に設定
		time.Now(),
		time.Now(),
	)
	// 複製したTODOを保存
	return u.TodoRepo.Create(&duplicatedTodo)
}
