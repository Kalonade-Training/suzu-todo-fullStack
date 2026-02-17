package todo

import (
	"fmt"
	"time"
	"todo-app-go/domain/entity"
	"todo-app-go/domain/repository"
	vo "todo-app-go/domain/value-object"
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
	userIDStr string,
	titleStr string,
	bodyStr string,
	dueDateTime time.Time,
) error {
	// Value Object生成
	userID, err := vo.FromStringUserID(userIDStr)
	if err != nil {
		return fmt.Errorf("invalid user ID: %w", err)
	}

	title, err := vo.FromStringTitle(titleStr)
	if err != nil {
		return fmt.Errorf("invalid title: %w", err)
	}

	body, err := vo.FromStringBody(bodyStr)
	if err != nil {
		return fmt.Errorf("invalid body: %w", err)
	}

	dueDate, err := vo.FromTimeDueDate(dueDateTime)
	if err != nil {
		return fmt.Errorf("invalid due date: %w", err)
	}

	// 既存タイトルチェック
	filters := repository.TodoFilters{
		Title: title.Value(),
	}
	existingTodos, err := u.TodoRepo.FindAll(userID, filters)
	if err != nil {
		return err
	}
	if len(existingTodos) > 0 {
		return fmt.Errorf("todo with this title already exists")
	}

	// エンティティ生成
	newTodo := entity.NewTodo(
		vo.NewTodoID(),
		userID,
		title,
		body,
		dueDate,
		vo.NewIsCompleted(false),
		time.Now(),
		time.Now(),
	)

	// DBに保存
	return u.TodoRepo.Create(&newTodo)
}
