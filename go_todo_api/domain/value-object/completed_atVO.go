package value_object

import (
	"errors"
	"regexp"
	"strconv"
)

type IsCompleted struct {
	value bool
}

// IsCompletedの生成関数
func FromBoolIsCompleted(v bool) (IsCompleted, error) {
	regex := regexp.MustCompile(`^(true|false)$`)
	if !regex.MatchString(strconv.FormatBool(v)) {
		return IsCompleted{}, errors.New("完了状態が無効です")
	}
	return IsCompleted{value: v}, nil
}

func NewIsCompleted(v bool) IsCompleted {
	return IsCompleted{value: v}
}

// IsCompletedの値を取得するメソッド
func (ic IsCompleted) Value() bool {
	return ic.value
}
