package repository

import (
	"todo-app-go/domain/entity"
	value_object "todo-app-go/domain/vo"
)

type IUserRepository interface {
	Save(user *entity.Users) (string, error)
	FindByEmail(email value_object.Email) (*entity.Users, error)
}
