package value_object

import (
	"errors"
	"regexp"
)

type Email struct {
	value string
}

func FromStringEmail(v string) (Email, error) {
	//	メールアドレス形式のチェック
	regex := regexp.MustCompile(`^[\w._%+\-]+@[\w.\-]+\.[A-Za-z]{2,}$`)
	if !regex.MatchString(v) {
		return Email{}, errors.New("無効なメールアドレス形式です")
	}
	return Email{value: v}, nil
}

func (e Email) Value() string {
	return e.value
}
