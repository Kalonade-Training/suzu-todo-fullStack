package user

import (
	"fmt"
	"strconv"
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

func (u *RegisterUsecase) Register(email value_object.Email, rawPassword value_object.RawPassword) (int, string, error) {
	// 既に登録されているメールアドレスかチェック
	existingUser, _ := u.UserRepo.FindByEmail(email)
	if existingUser != nil {
		return 0, "", fmt.Errorf("email already registered")
	}

	// パスワードをハッシュ化
	hashedPassword, err := rawPassword.Hash()
	if err != nil {
		return 0, "", err
	}

	// 新しいentity生成
	newUsers := entity.NewUser(
		value_object.NewUserID(),
		email,
		hashedPassword,
		time.Now(),
		time.Now(),
	)
	// DB保存して userID を取得
	userIDStr, err := u.UserRepo.Save(&newUsers)
	if err != nil {
		return 0, "", err
	}

	// token生成
	token, err := u.authClient.GenerateToken(userIDStr)
	if err != nil {
		return 0, "", err
	}

	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		return 0, "", err
	}

	return userID, token, nil
}
