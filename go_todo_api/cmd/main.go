package main

import (
	"log"
	"todo-app-go/di"
	"todo-app-go/infrastructure/authclient"
	"todo-app-go/interface/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Controllerを初期化
	userController, err := di.InitializedUserController()
	if err != nil {
		log.Fatalf("Failed to initialize user controller: %v", err)
	}

	// ルーティング設定
	//main
	r.POST("/register", userController.Register)
	r.POST("/login", userController.Login)

	//todo
	todoController, err := di.InitializedTodoController()
	if err != nil {
		log.Fatalf("Failed to initialize todo controller: %v", err)
	}

	authClient := authclient.NewAuthClient()

	authGroup := r.Group("/todos")
	authGroup.Use(middleware.AuthMiddleware(authClient)) // 認証ミドルウェアを適用
	authGroup.POST("/", todoController.CreateTodo)
	authGroup.GET("/", todoController.GetTodos)
	authGroup.PATCH("/:id", todoController.UpdateTodo)
	authGroup.DELETE("/:id", todoController.DeleteTodo)
	authGroup.POST("/:id/duplicate", todoController.DuplicateTodo)

	r.Run(":8080") //サーバー起動

}
