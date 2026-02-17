package value_object

import (
	"errors"
)

type Body struct {
	value string
}

// Bodyの生成関数
func FromStringBody(v string) (Body, error) {
	if len(v) == 0 || len(v) > 100 {
		return Body{}, errors.New("body must be between 1 and 100 characters")
	}
	return Body{value: v}, nil
}

// Bodyの値を取得するメソッド
func (b Body) Value() string {
	return b.value
}
