package value_object

import (
	"github.com/google/uuid"
)

type TodoID struct {
	value string
}

// TodoIDの生成関数
func NewTodoID() TodoID {
	id := uuid.New().String()
	return TodoID{value: id}
}
func FromStringTodoID(v string) (TodoID, error) {
	return TodoID{value: v}, nil
}

// TodoIDの値を取得するメソッド
func (t TodoID) Value() string {
	return t.value
}
