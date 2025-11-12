package value_object

import (
	"errors"
	"time"
)

type DueDate struct {
	value time.Time
}

// DueDateの生成関数
func FromTimeDueDate(v time.Time) (DueDate, error) {
	//今日より後の日付であることを確認
	today := time.Now().Truncate(24 * time.Hour)
	if v.Before(today) {
		return DueDate{}, errors.New("due date cannot be in the past")
	}

	return DueDate{value: v}, nil
}

// DueDateの値を取得するメソッド
func (d DueDate) Value() time.Time {
	return d.value
}
