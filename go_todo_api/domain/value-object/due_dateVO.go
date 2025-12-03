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
	// 使用するロケーションはローカル（サーバー設定）
	loc := time.Now().Location()

	// 今日の 00:00 を作る
	now := time.Now().In(loc)
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)

	// 受け取った v をローカルに変換して 00:00 に揃える（日時だけ比較するため）
	vLocal := v.In(loc)
	vDate := time.Date(vLocal.Year(), vLocal.Month(), vLocal.Day(), 0, 0, 0, 0, loc)

	// 過去日ならエラー
	if vDate.Before(today) {
		return DueDate{}, errors.New("due date cannot be in the past")
	}

	return DueDate{value: v}, nil
}

// DueDateの値を取得するメソッド
func (d DueDate) Value() time.Time {
	return d.value
}
