package main

import (
	"log"
	"todo-app-go/di"
	authclient "todo-app-go/infrastructure/auth_client"
	"todo-app-go/interface/middleware"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default() //Ginのデフォルトのルーターを取得

	// CORS設定
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},                     // React側URLのみ許可
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"}, //使用するHTTPメソッド(OPTIONSはプリフライトリクエスト用(メソッド確認))
		AllowHeaders:     []string{"Content-Type", "Authorization"},             //許可するヘッダー(token許可)
		AllowCredentials: true,                                                  //クッキーの送信を許可（セッション管理やJWT）
		MaxAge:           24 * time.Hour,                                        //プリフライトリクエストのキャッシュ時間
	}))

	r.Use(middleware.ErrorHandler()) //エラーレスポンスの形式を統一するミドルウェア

	// Controllerを初期化
	userController, err := di.InitializedUserController()
	if err != nil {
		log.Fatalf("Failed to initialize user controller: %v", err)
		//依存関係の構築に失敗した際fatalfでプログラム強制終了
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

	authClient := authclient.NewAuthClient() //認証クライアントの作成

	authGroup := r.Group("/todos")
	authGroup.Use(middleware.AuthMiddleware(authClient)) //認証クライアントをミドルウェアに渡す
	//todo以下のルーティングはすべて認証ミドルウェアを通過する
	authGroup.POST("/create", todoController.CreateTodo)
	authGroup.GET("", todoController.GetTodos)
	authGroup.PATCH("/:id/update", todoController.UpdateTodo)
	authGroup.DELETE("/:id/delete", todoController.DeleteTodo)
	authGroup.POST("/:id/duplicate", todoController.DuplicateTodo)
	authGroup.GET("/:id/detail", todoController.GetDetail)

	// サーバー起動

	r.Run(":8080") //サーバー起動

}
