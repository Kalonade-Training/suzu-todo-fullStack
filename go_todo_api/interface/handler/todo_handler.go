package handler

import (
	"fmt"
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

// GET /todos/:id/detail
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

	// 修正：エンティティをレスポンス用に変換（GetTodosと同じ形式に統一）
	response := gin.H{
		"id":          todo.ID().Value(),
		"user_id":     todo.UserID().Value(),
		"title":       todo.Title().Value(),
		"body":        todo.Body().Value(),
		"isCompleted": todo.IsCompleted().Value(),
		"createdAt":   todo.CreatedAt(),
		"updatedAt":   todo.UpdatedAt(),
	}

	// DueDateはnilの可能性があるのでチェック
	if todo.DueDate() != nil {
		response["dueDate"] = todo.DueDate().Value().Format("2006-01-02")
	} else {
		response["dueDate"] = ""
	}

	c.JSON(http.StatusOK, gin.H{"todo": response})
}

// POST /todos
func (h *TodoHandler) CreateTodo(c *gin.Context) {
	// リクエストボディのバインド
	var req struct {
		Title   string `json:"title" binding:"required" `
		Body    string `json:"body" binding:"required" `
		DueDate string `json:"due_date"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// ユーザーIDを取得
	userIDStr := c.GetString("userID")
	// DueDate を日本時間でパース
	var dueDateValue *time.Time

	if req.DueDate != "" {
		// DueDate を日本時間でパース
		loc := time.FixedZone("Asia/Tokyo", 9*60*60)
		// 日付だけの形式を想定 "YYYY-MM-DD"
		v, err := time.ParseInLocation("2006-01-02", req.DueDate, loc)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid due date format (expected YYYY-MM-DD)"})
			return
		}
		dueDateValue = &v // ポインタとして有効な値をセット

		// DueDate value object の validation のみ実行
		// パースしたtime.Time値でVOのバリデーションを実施
		_, err = value_object.FromTimeDueDate(v)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

	}
	// ユースケースを呼び出し
	newTodo, err := h.createTodoUsecase.Execute(userIDStr, req.Title, req.Body, dueDateValue)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("failed to create todo: %s", err.Error())})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message": "Todo created successfully",
		"id":      newTodo.ID().Value(), // 新しいIDをフロントエンドに返す
		"todo":    newTodo,              // 必要に応じてエンティティ全体も返す
	})
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
	// エンティティをレスポンス用に変換
	var response []gin.H
	for _, todo := range todos {
		item := gin.H{
			"id":          todo.ID().Value(),
			"user_id":     todo.UserID().Value(),
			"title":       todo.Title().Value(),
			"body":        todo.Body().Value(),
			"isCompleted": todo.IsCompleted().Value(),
			"createdAt":   todo.CreatedAt(),
			"updatedAt":   todo.UpdatedAt(),
		}
		// DueDateはnilの可能性があるのでチェック
		if todo.DueDate() != nil {
			item["dueDate"] = todo.DueDate().Value().Format("2006-01-02")
		} else {
			item["dueDate"] = ""
		}
		response = append(response, item)
	}
	c.JSON(http.StatusOK, gin.H{"todos": response})
}

// PATCH /todos/:id/update
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
		DueDate   string `json:"due_date"` // 例: "2025-11-11"
		Completed bool   `json:"completedAt"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 期日文字列を timeに変換
	var dueDatePtr *time.Time
	if req.DueDate != "" {
		t, err := time.Parse("2006-01-02", req.DueDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format (expected YYYY-MM-DD)"})
			return
		}
		dueDatePtr = &t // ポインタとしてセット
	}

	// Usecase実行
	err = h.updateTodoUsecase.Update(todoID, req.Title, req.Body, dueDatePtr, req.Completed)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//修正：更新後のTodo情報を返す
	// 更新後のTodoを取得
	updatedTodo, err := h.getDetailTodoUsecase.GetDetail(todoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// エンティティをレスポンス用に変換
	response := gin.H{
		"id":          updatedTodo.ID().Value(),
		"user_id":     updatedTodo.UserID().Value(),
		"title":       updatedTodo.Title().Value(),
		"body":        updatedTodo.Body().Value(),
		"isCompleted": updatedTodo.IsCompleted().Value(),
		"createdAt":   updatedTodo.CreatedAt(),
		"updatedAt":   updatedTodo.UpdatedAt(),
	}

	// DueDateはnilの可能性があるのでチェック
	if updatedTodo.DueDate() != nil {
		response["dueDate"] = updatedTodo.DueDate().Value().Format("2006-01-02")
	} else {
		response["dueDate"] = ""
	}

	c.JSON(http.StatusOK, response)
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
