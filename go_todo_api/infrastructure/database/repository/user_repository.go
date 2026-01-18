package repository

import (
	"fmt"
	"todo-app-go/domain/entity"
	"todo-app-go/domain/repository"
	value_object "todo-app-go/domain/vo"
	"todo-app-go/infrastructure/database/model"

	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (repo *UserRepository) Save(user *entity.Users) (string, error) {
	modelUser := entityToModel(*user)
	err := repo.DB.Create(modelUser).Error
	if err != nil {
		return "", fmt.Errorf("登録できません: %w", err)
	}
	return modelUser.ID, nil
}

func (repo *UserRepository) FindByEmail(email value_object.Email) (*entity.Users, error) {
	var users model.Users
	err := repo.DB.Where("email = ?", email.Value()).First(&users).Error
	if err != nil {
		return nil, fmt.Errorf("ユーザーが見つかりません: %w", err)
	}
	userEntity := modelToEntity(users)
	return &userEntity, nil
}

func entityToModel(user entity.Users) *model.Users {
	return &model.Users{
		ID:        user.ID().Value(),
		Email:     user.Email().Value(),
		Password:  user.HashedPassword().Value(),
		CreatedAt: user.CreatedAt(),
		UpdatedAt: user.UpdatedAt(),
	}
}

func modelToEntity(user model.Users) entity.Users {
	email, _ := value_object.FromStringEmail(user.Email)
	hashedPassword := value_object.FromStringHashedPassword(user.Password)
	id, _ := value_object.FromStringUserID(user.ID)
	return entity.NewUser(
		id,
		email,
		hashedPassword,
		user.CreatedAt,
		user.UpdatedAt,
	)
}

func NewUserRepositoryProvider(db *gorm.DB) repository.IUserRepository {
	return NewUserRepository(db)
}
