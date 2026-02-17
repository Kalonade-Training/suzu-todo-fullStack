package entity

import (
	"time"
	value_object "todo-app-go/domain/vo"
)

type Users struct {
	id             value_object.UserID
	email          value_object.Email
	hashedPassword value_object.HashedPassword
	createdAt      time.Time
	updatedAt      time.Time
}

func NewUser(id value_object.UserID, email value_object.Email, hashedPassword value_object.HashedPassword, createdAt, updatedAt time.Time) Users {
	return Users{
		id:             id,
		email:          email,
		hashedPassword: hashedPassword,
		createdAt:      createdAt,
		updatedAt:      updatedAt,
	}
}
func (u Users) ID() value_object.UserID {
	return u.id
}
func (u Users) Email() value_object.Email {
	return u.email
}
func (u Users) HashedPassword() value_object.HashedPassword {
	return u.hashedPassword
}
func (u Users) CreatedAt() time.Time {
	return u.createdAt
}
func (u Users) UpdatedAt() time.Time {
	return u.updatedAt
}
