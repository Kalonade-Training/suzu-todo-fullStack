package todo

import (
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
	dueDate time.Time,
	completed bool,
) error {
	// value_object を作る
	titleVO, err := value_object.FromStringTitle(title)
	if err != nil {
		return err
	}
	bodyVO, err := value_object.FromStringBody(body)
	if err != nil {
		return err
	}
	dueDateVO, err := value_object.FromTimeDueDate(dueDate)
	if err != nil {
		return err
	}
	isCompletedVO := value_object.NewIsCompleted(completed)

	// entity のコンストラクタで Todo を作る
	todo := entity.NewTodo(
		todoID,
		value_object.UserID{}, // UserID は更新しないので空で良い
		titleVO,
		bodyVO,
		dueDateVO, // DueDate があれば設定
		isCompletedVO,
		time.Now(), // CreatedAt
		time.Now(), // UpdatedAt
	)

	// リポジトリの メソッドを呼び出す
	return uc.repo.Update(&todo)
}
