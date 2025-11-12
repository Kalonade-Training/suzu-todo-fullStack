package handler

import (
	"net/http"
	"strconv"
	"time"
	"todo-app-go/application/todo"
	value_object "todo-app-go/domain/value-object"

	"github.com/gin-gonic/gin"
)

type TodoHandler struct {
	createTodoUsecase    *todo.CreateTodoUsecase
	getTodoUsecase       *todo.GetTodoUsecase
	getDetailTodoUsecase *todo.GetDetailTodoUsecase
	updateTodoUsecase    *todo.UpdateTodoUsecase
	deleteTodoUsecase    *todo.DeleteTodoUsecase
	duplicateTodoUsecase *todo.DuplicateTodoUsecase
}

func NewTodoHandler(
	createTodoUsecase *todo.CreateTodoUsecase,
	getTodoUsecase *todo.GetTodoUsecase,
	getDetailTodoUsecase *todo.GetDetailTodoUsecase,
	updateTodoUsecase *todo.UpdateTodoUsecase,
	deleteTodoUsecase *todo.DeleteTodoUsecase,
	duplicateTodoUsecase *todo.DuplicateTodoUsecase,
) *TodoHandler {
	return &TodoHandler{
		createTodoUsecase:    createTodoUsecase,
		getTodoUsecase:       getTodoUsecase,
		getDetailTodoUsecase: getDetailTodoUsecase,
		updateTodoUsecase:    updateTodoUsecase,
		deleteTodoUsecase:    deleteTodoUsecase,
		duplicateTodoUsecase: duplicateTodoUsecase,
	}
}

// GET /todos/:id
func (h *TodoHandler) GetDetail(c *gin.Context) {
	// URLパラメータからTodoIDを取得
	todoID, err := value_object.FromStringTodoID(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid todo ID"})
		return
	}
	// ユースケースを呼び出し
	todo, err := h.getDetailTodoUsecase.GetDetail(todoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"todo": todo})
}

// POST /todos
func (h *TodoHandler) CreateTodo(c *gin.Context) {
	// リクエストボディのバインド
	var req struct {
		Title   string    `json:"title" binding:"required"`
		Body    string    `json:"body" binding:"required"`
		DueDate time.Time `json:"due_date" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// ユーザーIDを取得
	userIDStr := c.GetString("userID")
	// ユースケースを呼び出し
	err := h.createTodoUsecase.Execute(userIDStr, req.Title, req.Body, req.DueDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Todo created successfully"})
}

// GET /todos
func (h *TodoHandler) GetTodos(c *gin.Context) {
	//ユーザーIDを取得
	userIDStr := c.GetString("userID")
	userID, err := value_object.FromStringUserID(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	// クエリパラメータを取得
	title := c.Query("title")
	body := c.Query("body")

	var dueDateFromPtr, dueDateToPtr *time.Time
	if s := c.Query("due_date_from"); s != "" {
		t, err := time.Parse("2006-01-02", s)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid due_date_from"})
			return
		}
		dueDateFromPtr = &t
	}
	if s := c.Query("due_date_to"); s != "" {
		t, err := time.Parse("2006-01-02", s)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid due_date_to"})
			return
		}
		dueDateToPtr = &t
	}

	var completedPtr *bool
	if s := c.Query("completed"); s != "" {
		b, err := strconv.ParseBool(s)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid completed value"})
			return
		}
		completedPtr = &b
	}
	// ユースケースを呼び出し
	todos, err := h.getTodoUsecase.Execute(userID, title, body, dueDateFromPtr, dueDateToPtr, completedPtr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"todos": todos})
}

// PATCH /todos/:id
func (h *TodoHandler) UpdateTodo(c *gin.Context) {
	// URLパラメータからTodoIDを取得
	todoID, err := value_object.FromStringTodoID(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid todo ID"})
		return
	}

	// JSONリクエストを受け取る
	var req struct {
		Title     string `json:"title" binding:"required"`
		Body      string `json:"body" binding:"required"`
		DueDate   string `json:"due_date" binding:"required"` // 例: "2025-11-11"
		Completed bool   `json:"completed"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 期日文字列を timeに変換
	dueDate, err := time.Parse("2006-01-02", req.DueDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format (expected YYYY-MM-DD)"})
		return
	}

	// Usecase実行
	err = h.updateTodoUsecase.Update(todoID, req.Title, req.Body, dueDate, req.Completed)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Todo updated successfully"})
}

// DELETE /todos/:id
func (h *TodoHandler) DeleteTodo(c *gin.Context) {
	// URLパラメータからTodoIDを取得
	todoID, err := value_object.FromStringTodoID(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid todo ID"})
		return
	}
	// Usecase実行
	err = h.deleteTodoUsecase.Delete(todoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Todo deleted successfully"})
}

// POST /todos/:id/duplicate
func (h *TodoHandler) DuplicateTodo(c *gin.Context) {
	// URLパラメータからTodoIDを取得
	todoID, err := value_object.FromStringTodoID(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid todo ID"})
		return
	}
	// Usecase実行
	err = h.duplicateTodoUsecase.Duplicate(todoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Todo duplicated successfully"})
}
