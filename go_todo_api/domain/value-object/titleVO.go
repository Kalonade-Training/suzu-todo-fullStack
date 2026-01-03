package value_object

import (
	"errors"
	"strings"
)

type Title struct {
	value string
}

func FromStringTitle(v string) (Title, error) {
	trimmed := strings.TrimSpace(v)

	if len(trimmed) == 0 || len(trimmed) > 50 {
		return Title{}, errors.New("タイトルは1文字以上50文字以下である必要があります")
	}

	return Title{value: trimmed}, nil
}

// Titleの値を取得するメソッド
func (t Title) Value() string {
	return t.value
}
