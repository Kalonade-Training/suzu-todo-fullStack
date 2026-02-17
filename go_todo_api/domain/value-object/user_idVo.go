package value_object

import (
	"github.com/google/uuid"
)

type UserID struct {
	value string
}

func (u UserID) String() string {
	panic("unimplemented")
}

func NewUserID() UserID {
	id := uuid.New().String()
	return UserID{value: id}
}

func FromStringUserID(v string) (UserID, error) {
	return UserID{value: v}, nil
}

func (u UserID) Value() string {
	return u.value
}
