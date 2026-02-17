package value_object

import (
	"errors"
	"regexp"
)

type Title struct {
	value string
}

// Titleの生成関数
func FromStringTitle(v string) (Title, error) {
	if len(v) == 0 || len(v) > 50 {
		return Title{}, errors.New("title must be between 1 and 50 characters")
	}
	// 英数字のみ検出
	regex := regexp.MustCompile(`^[a-zA-Z0-9\s]+$`)
	if !regex.MatchString(v) {
		return Title{}, errors.New("title contains invalid characters")
	}
	//空白検出
	if regexp.MustCompile(`^\s+|\s+$`).MatchString(v) {
		return Title{}, errors.New("title cannot be only whitespace")
	}

	return Title{value: v}, nil
}

// Titleの値を取得するメソッド
func (t Title) Value() string {
	return t.value
}
