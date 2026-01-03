package user

import (
	"errors"
	"todo-app-go/domain/auth"
	"todo-app-go/domain/repository"
	value_object "todo-app-go/domain/value-object"
)

type LoginUsecase struct {
	UserRepo   repository.IUserRepository
	authClient auth.IAuthClient
}

func NewLoginUsecase(userRepo repository.IUserRepository, authClient auth.IAuthClient) *LoginUsecase {
	return &LoginUsecase{
		UserRepo:   userRepo,
		authClient: authClient,
	}
}

func (u *LoginUsecase) Login(email value_object.Email, rawPassword value_object.RawPassword) (string, error) {
	// ユーザーをメールで検索
	user, _ := u.UserRepo.FindByEmail(email)
	if user == nil {
		return "", errors.New("ユーザーが存在しません")
	}

	// パスワードを照合
	err := user.HashedPassword().ComparePassword(rawPassword)
	if err != nil {
		return "", errors.New("パスワードが正しくありません")
	}

	token, err := u.authClient.GenerateToken(user.ID().Value())
	if err != nil {
		return "", err
	}

	return token, nil
}
