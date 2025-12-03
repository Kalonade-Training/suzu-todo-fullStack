package main

import (
	"log"
	"todo-app-go/di"
	"todo-app-go/infrastructure/authclient"
	"todo-app-go/interface/middleware"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// CORS設定
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // React側
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           24 * time.Hour,
	}))

	// Controllerを初期化
	userController, err := di.InitializedUserController()
	if err != nil {
		log.Fatalf("Failed to initialize user controller: %v", err)
	}

	// ルーティング設定
	//main
	r.POST("/auth/register", userController.Register)
	r.POST("/auth/login", userController.Login)

	//todo
	todoController, err := di.InitializedTodoController()
	if err != nil {
		log.Fatalf("Failed to initialize todo controller: %v", err)
	}

	authClient := authclient.NewAuthClient()

	authGroup := r.Group("/todos")
	authGroup.Use(middleware.AuthMiddleware(authClient)) // 認証ミドルウェアを適用
	authGroup.POST("/create", todoController.CreateTodo)
	authGroup.GET("", todoController.GetTodos)
	authGroup.PATCH("/:id/update", todoController.UpdateTodo)
	authGroup.DELETE("/:id/delete", todoController.DeleteTodo)
	authGroup.POST("/:id/duplicate", todoController.DuplicateTodo)
	authGroup.GET("/:id/detail", todoController.GetDetail)

	// サーバー起動

	r.Run(":8080") //サーバー起動

}
