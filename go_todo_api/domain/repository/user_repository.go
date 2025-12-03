package repository

import (
	"todo-app-go/domain/entity"
	value_object "todo-app-go/domain/value-object"
)

type IUserRepository interface {
	Save(user *entity.Users) (string, error)
	FindByEmail(email value_object.Email) (*entity.Users, error)
}
