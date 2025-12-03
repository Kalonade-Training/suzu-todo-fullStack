package repository

import (
	"fmt"
	"time"
	"todo-app-go/domain/entity"
	"todo-app-go/domain/repository"
	value_object "todo-app-go/domain/value-object"
	"todo-app-go/infrastructure/database/model"

	"gorm.io/gorm"
)

type TodoRepository struct {
	DB *gorm.DB
}

// Delete は Todo を削除する
func (repo *TodoRepository) Delete(todoID value_object.TodoID) error {
	err := repo.DB.Delete(&model.Todos{}, "id = ?", todoID.Value()).Error
	if err != nil {
		return fmt.Errorf("failed to delete todo: %w", err)
	}
	return nil
}

// FindAll はフィルター条件に基づいて Todo を取得する
func (repo *TodoRepository) FindAll(userID value_object.UserID, filters repository.TodoFilters) ([]entity.Todos, error) {
	var todos []model.Todos
	query := repo.DB.Model(&model.Todos{}).Where("user_id = ?", userID.Value())

	// フィルターの設定
	if filters.Title != "" {
		query = query.Where("title LIKE ?", "%"+filters.Title+"%")
	}
	if filters.Body != "" {
		query = query.Where("body LIKE ?", "%"+filters.Body+"%")
	}
	if !filters.DueDateFrom.IsZero() {
		query = query.Where("due_date >= ?", filters.DueDateFrom)
	}
	if !filters.DueDateTo.IsZero() {
		query = query.Where("due_date <= ?", filters.DueDateTo)
	}
	if filters.Completed != nil {
		query = query.Where("is_completed = ?", *filters.Completed)
	}

	// 並び替え（作成日時の降順）
	query = query.Order("created_at DESC")

	// 実行
	if err := query.Find(&todos).Error; err != nil {
		return nil, fmt.Errorf("failed to find todos: %w", err)
	}

	// model → entity 変換
	var entities []entity.Todos
	for _, t := range todos {
		entities = append(entities, modelToEntityTodo(t))
	}

	return entities, nil
}

// Update は Todo を更新する
func (repo *TodoRepository) Update(todo *entity.Todos) error {
	modelTodo := entityToModelTodo(*todo)
	err := repo.DB.Save(modelTodo).Error
	if err != nil {
		return fmt.Errorf("failed to update todo: %w", err)
	}
	return nil
}

// NewTodoRepository は TodoRepository のコンストラクタ
func NewTodoRepository(db *gorm.DB) *TodoRepository {
	return &TodoRepository{DB: db}
}

// Create は Todo を作成する
func (repo *TodoRepository) Create(todo *entity.Todos) error {
	modelTodo := entityToModelTodo(*todo)
	err := repo.DB.Create(modelTodo).Error
	if err != nil {
		return fmt.Errorf("failed to create todo: %w", err)
	}
	return nil
}

// FindByUserID は ユーザーID で Todo を取得する
func (repo *TodoRepository) FindByUserID(userID value_object.UserID) ([]entity.Todos, error) {
	var todos []model.Todos
	err := repo.DB.Where("user_id = ?", userID.Value()).Find(&todos).Error
	if err != nil {
		return nil, fmt.Errorf("failed to find todos: %w", err)
	}
	var entities []entity.Todos
	for _, t := range todos {
		entities = append(entities, modelToEntityTodo(t))
	}
	return entities, nil
}

// FindById は ID で Todo を取得する
func (repo *TodoRepository) FindById(todoID value_object.TodoID) (*entity.Todos, error) {
	var todo model.Todos
	err := repo.DB.Where("id = ?", todoID.Value()).First(&todo).Error
	if err != nil {
		return nil, fmt.Errorf("failed to find todo: %w", err)
	}
	entityTodo := modelToEntityTodo(todo)
	return &entityTodo, nil
}

// entityToModelTodo は entity.Todos を model.Todos に変換するヘルパー関数
func entityToModelTodo(todo entity.Todos) *model.Todos {
	var dueDatePtr *time.Time
	if todo.DueDate() != nil {
		dueDate := todo.DueDate().Value()
		dueDatePtr = &dueDate
	}

	return &model.Todos{
		ID:          todo.ID().Value(),
		UserID:      todo.UserID().Value(),
		Title:       todo.Title().Value(),
		Body:        todo.Body().Value(),
		DueDate:     dueDatePtr,
		IsCompleted: todo.IsCompleted().Value(),
		CreatedAt:   todo.CreatedAt(),
		UpdatedAt:   todo.UpdatedAt(),
	}
}

// modelToEntityTodo は model.Todos を entity.Todos に変換するヘルパー関数
func modelToEntityTodo(todo model.Todos) entity.Todos {
	userID, _ := value_object.FromStringUserID(todo.UserID)
	title, _ := value_object.FromStringTitle(todo.Title)
	body, _ := value_object.FromStringBody(todo.Body)
	isCompleted, _ := value_object.FromBoolIsCompleted(todo.IsCompleted)
	id, _ := value_object.FromStringTodoID(todo.ID)

	var dueDateVO *value_object.DueDate = nil
	if todo.DueDate != nil && !todo.DueDate.IsZero() {
		tmp, _ := value_object.FromTimeDueDate(*todo.DueDate)
		dueDateVO = &tmp
	} else {
		dueDateVO = nil
	}

	return entity.NewTodo(
		id,
		userID,
		title,
		body,
		dueDateVO,
		isCompleted,
		todo.CreatedAt,
		todo.UpdatedAt,
	)
}

// NewTodoRepositoryProvider は TodoRepository のプロバイダ関数
func NewTodoRepositoryProvider(db *gorm.DB) repository.ITodoRepository {
	return NewTodoRepository(db)
}
