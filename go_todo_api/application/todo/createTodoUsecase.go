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
	dueDateValue *time.Time,
) (*entity.Todos, error) {

	userID, err := vo.FromStringUserID(userIDStr)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %w", err)
	}

	title, err := vo.FromStringTitle(titleStr)
	if err != nil {
		return nil, fmt.Errorf("invalid title: %w", err)
	}

	body, err := vo.FromStringBody(bodyStr)
	if err != nil {
		return nil, fmt.Errorf("invalid body: %w", err)
	}

	// DueDate VO のポインタ
	var dueDatePtr *vo.DueDate

	// 修正: dueDateValue が nil でない（つまり日付が指定されている）場合のみ VO を生成
	if dueDateValue != nil {
		// *time.Time をデリファレンスして time.Time 値を取り出し、VOを生成
		dueDateVO, err := vo.FromTimeDueDate(*dueDateValue)
		if err != nil {
			return nil, fmt.Errorf("invalid due date: %w", err)
		}
		// 生成したVOのポインタをセット
		dueDatePtr = &dueDateVO
	}

	// 重複タイトルチェック
	filters := repository.TodoFilters{
		Title: title.Value(),
	}

	existing, err := u.TodoRepo.FindAll(userID, filters)
	if err != nil {
		return nil, err
	}
	if len(existing) > 0 {
		return nil, fmt.Errorf("todo with this title already exists")
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
