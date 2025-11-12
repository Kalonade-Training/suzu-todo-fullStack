package user

import (
	"fmt"
	"time"

	"todo-app-go/domain/auth"
	"todo-app-go/domain/entity"
	"todo-app-go/domain/repository"
	value_object "todo-app-go/domain/value-object"
)

type RegisterUsecase struct {
	UserRepo   repository.IUserRepository
	authClient auth.IAuthClient
}

func NewRegisterUsecase(userRepo repository.IUserRepository, authClient auth.IAuthClient) *RegisterUsecase {
	return &RegisterUsecase{
		UserRepo:   userRepo,
		authClient: authClient}
}

func (u *RegisterUsecase) Register(email value_object.Email, rawPassword value_object.RawPassword) (string, error) {
	// 既に登録されているメールアドレスかチェック
	existingUser, _ := u.UserRepo.FindByEmail(email)
	if existingUser != nil {
		return "", fmt.Errorf("email already registered")
	}

	// パスワードをハッシュ化
	hashedPassword, err := rawPassword.Hash()
	if err != nil {
		return "", err
	}

	// entity生成
	newUsers := entity.NewUser(
		value_object.NewUserID(),
		email,
		hashedPassword,
		time.Now(),
		time.Now(),
	)

	// DB保存
	return "", u.UserRepo.Save(&newUsers)
}
