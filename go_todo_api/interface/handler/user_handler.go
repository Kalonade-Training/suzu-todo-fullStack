package handler

import (
	"net/http"

	"todo-app-go/application/user"
	value_object "todo-app-go/domain/value-object"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	registerUsecase *user.RegisterUsecase
	loginUsecase    *user.LoginUsecase
}

// コンストラクタ
func NewUserHandler(
	registerUsecase *user.RegisterUsecase,
	loginUsecase *user.LoginUsecase,
) *UserHandler {
	return &UserHandler{
		registerUsecase: registerUsecase,
		loginUsecase:    loginUsecase,
	}
}

// リクエスト
type RegisterRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// POST /register
func (h *UserHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(err)
		return
	}

	email, err := value_object.FromStringEmail(req.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	rawPassword := value_object.FromStringRawPassword(req.Password)

	userID, token, err := h.registerUsecase.Register(email, rawPassword)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":    userID,
		"email": email.Value(),
		"token": token})
}

// POST /login
func (h *UserHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Error(err)
		return
	}

	email, err := value_object.FromStringEmail(req.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	rawPassword := value_object.FromStringRawPassword(req.Password)

	token, err := h.loginUsecase.Login(email, rawPassword)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"email": email.Value(),
	})
}
