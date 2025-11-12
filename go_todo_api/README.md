go-todo-api
├── go.mod
├── go.sum
├── README.md
├── application
│   ├── todo
│   │   ├── createTodoUsecase.go
│   │   ├── deleteTodoUsecase.go
│   │   ├── duplicateTodoUsecase.go
│   │   ├── getDetailTodoUsecase.go
│   │   ├── getTodoUsecase.go
│   │   └── updateTodoUsecase.go
│   └── user
│       ├── loginUsecase.go
│       └── registerUsecase.go
├── cmd
│   └── main.go
├── di
│   ├── container.go
│   └── wire_gen.go
├── domain
│   ├── auth
│   │   └── auth.go
│   ├── entity
│   │   ├── todo.go
│   │   └── user.go
│   ├── repository
│   │   ├── todo_filter.go
│   │   ├── todo_repository.go
│   │   └── user_repository.go
│   └── value-object
│       ├── bodyVO.go
│       ├── completed_atVO.go
│       ├── due_dateVO.go
│       ├── emailVO.go
│       ├── passwordVO.go
│       ├── titleVO.go
│       ├── todo_idVO.go
│       └── user_idVO.go
├── infrastructure
│   ├── authclient
│   │   └── jwt_client.go
│   └── database
│       ├── mysql.go
│       ├── model
│       │   ├── todo.go
│       │   └── user.go
│       └── repository
│           ├── todo_repository.go
│           └── user_repository.go
└── interface
    ├── handler
    │   ├── todo_handler.go
    │   └── user_handler.go
    └── middleware
        └── auth_middleware.go
