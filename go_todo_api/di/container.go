package di

//依存関係を整理して正しい順序にする
import (
	"todo-app-go/application/todo"
	"todo-app-go/application/user"
	"todo-app-go/infrastructure/authclient"
	"todo-app-go/infrastructure/database"
	"todo-app-go/infrastructure/database/repository"
	"todo-app-go/interface/handler"

	"github.com/google/wire"
)

// UserControllerの依存関係組み立て
func InitializeUserController() (*handler.UserHandler, error) {
	wire.Build(
		database.NewGormDB,
		repository.NewUserRepositoryProvider,
		handler.NewUserHandler,
		user.NewLoginUsecase,
		user.NewRegisterUsecase,
		authclient.NewAuthClient,
	)
	return &handler.UserHandler{}, nil
}

// TodoControllerの依存関係組み立て
func InitializeTodoController() (*handler.TodoHandler, error) {
	wire.Build(
		database.NewGormDB,
		repository.NewTodoRepositoryProvider,
		handler.NewTodoHandler,
		todo.NewCreateTodoUsecase,
		todo.NewGetTodoUsecase,
		todo.NewGetDetailTodoUsecase,
		todo.NewUpdateTodoUsecase,
		todo.NewDeleteTodoUsecase,
		todo.NewDuplicateTodoUsecase,
	)
	return &handler.TodoHandler{}, nil
}
