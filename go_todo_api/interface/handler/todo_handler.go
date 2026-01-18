package handler

import (
	"net/http"
	"strconv"
	"time"
	"todo-app-go/application/todo"
	vo "todo-app-go/domain/vo"

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
	todoID, err := vo.FromStringTodoID(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{ //404に修正
			"error": "指定されたタスクが見つかりません",
		})
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
		c.Error(err)
		c.Abort()
		return
	}
	// valueObjectをユースケースから移動
	userID, err := vo.FromStringUserID(c.GetString("userID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ユーザーIDが不正です"})
		return
	}

	title, err := vo.FromStringTitle(req.Title)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	body, err := vo.FromStringBody(req.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var dueDatePtr *vo.DueDate
	if req.DueDate != "" {
		loc := time.FixedZone("Asia/Tokyo", 9*60*60)
		t, err := time.ParseInLocation("2006-01-02", req.DueDate, loc)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "日付形式が不正です"})
			return
		}

		dueDateVO, err := vo.FromTimeDueDate(t)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		dueDatePtr = &dueDateVO
	}

	// ユースケースを呼び出し
	newTodo, err := h.createTodoUsecase.Execute(
		userID,
		title,
		body,
		dueDatePtr,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"id":   newTodo.ID().Value(), // 新しいIDをフロントエンドに返す
		"todo": newTodo,              // 必要に応じてエンティティ全体も返す
	})
}

// GET /todos
func (h *TodoHandler) GetTodos(c *gin.Context) {
	//ユーザーIDを取得
	userIDStr := c.GetString("userID")
	userID, err := vo.FromStringUserID(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ログインしてください",
		})
		return
	}
	// クエリパラメータを取得
	var titleVO *vo.Title
	if s := c.Query("title"); s != "" {
		vo, err := vo.FromStringTitle(s)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		titleVO = &vo
	}

	var bodyVO *vo.Body
	if s := c.Query("body"); s != "" {
		vo, err := vo.FromStringBody(s)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		bodyVO = &vo
	}

	var dueDateFromPtr, dueDateToPtr *time.Time
	if s := c.Query("due_date_from"); s != "" {
		t, err := time.Parse("2006-01-02", s)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "無効な日付です"})
			return
		}
		dueDateFromPtr = &t
	}
	if s := c.Query("due_date_to"); s != "" {
		t, err := time.Parse("2006-01-02", s)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "無効な日付です"})
			return
		}
		dueDateToPtr = &t
	}

	var completedPtr *bool
	if s := c.Query("completed"); s != "" {
		b, err := strconv.ParseBool(s)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "完了状態が無効です"})
			return
		}
		completedPtr = &b
	}
	// ユースケースを呼び出し
	todos, err := h.getTodoUsecase.Execute(
		userID,
		titleVO,
		bodyVO,
		dueDateFromPtr,
		dueDateToPtr,
		completedPtr,
	)
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
	todoID, err := vo.FromStringTodoID(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{ //404に修正
			"error": "指定されたタスクが見つかりません",
		})
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
		c.Error(err)
		c.Abort()
		return
	}

	//ValueObject 変換
	titleVO, err := vo.FromStringTitle(req.Title)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bodyVO, err := vo.FromStringBody(req.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	isCompletedVO := vo.NewIsCompleted(req.Completed)

	var dueDateVO *vo.DueDate
	if req.DueDate != "" {
		t, err := time.Parse("2006-01-02", req.DueDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "日付形式が正しくありません"})
			return
		}
		d, err := vo.FromTimeDueDate(t)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		dueDateVO = &d
	}

	// Usecase実行
	err = h.updateTodoUsecase.Update(
		todoID,
		titleVO,
		bodyVO,
		dueDateVO,
		isCompletedVO,
	)
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
	todoID, err := vo.FromStringTodoID(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{ //404に修正
			"error": "指定されたタスクが見つかりません",
		})
		return
	}
	// Usecase実行
	err = h.deleteTodoUsecase.Delete(todoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "タスクが削除されました！"})
}

// POST /todos/:id/duplicate
func (h *TodoHandler) DuplicateTodo(c *gin.Context) {
	// URLパラメータからTodoIDを取得
	todoID, err := vo.FromStringTodoID(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "指定されたタスクが見つかりません",
		})
		return
	}
	// Usecase実行
	err = h.duplicateTodoUsecase.Duplicate(todoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "タスクが複製されました！"})
}
