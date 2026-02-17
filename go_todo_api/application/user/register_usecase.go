package user

import (
	"fmt"
	"time"

	"todo-app-go/domain/auth"
	"todo-app-go/domain/entity"
	"todo-app-go/domain/repository"
	value_object "todo-app-go/domain/vo"
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

func (u *RegisterUsecase) Register(email value_object.Email, rawPassword value_object.RawPassword) (value_object.UserID, string, error) {
	// 既に登録されているメールアドレスかチェック
	existingUser, _ := u.UserRepo.FindByEmail(email)
	if existingUser != nil {
		return value_object.UserID{}, "", fmt.Errorf("このメールアドレスは既に登録されています")
	}

	// パスワードをハッシュ化
	hashedPassword, err := rawPassword.Hash()
	if err != nil {
		return value_object.UserID{}, "", err
	}

	userID := value_object.NewUserID()
	// 新しいentity生成
	newUsers := entity.NewUser(
		userID,
		email,
		hashedPassword,
		time.Now(),
		time.Now(),
	)
	// DB保存して userID を取得
	userIDStr, err := u.UserRepo.Save(&newUsers)
	if err != nil {
		return value_object.UserID{}, "", err
	}

	// token生成
	token, err := u.authClient.GenerateToken(userIDStr)
	if err != nil {
		return value_object.UserID{}, "", err
	}

	return userID, token, nil
}
