package value_object

import (
	"errors"
	"strings"
)

type Body struct {
	value string
}

// Bodyの生成関数
func FromStringBody(v string) (Body, error) {
	trimmed := strings.TrimSpace(v)
	if len(trimmed) == 0 || len(trimmed) > 100 {
		return Body{}, errors.New("本文は1文字以上100文字以下である必要があります")
	}
	return Body{value: trimmed}, nil
}

// Bodyの値を取得するメソッド
func (b Body) Value() string {
	return b.value
}
