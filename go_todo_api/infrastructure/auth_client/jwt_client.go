package auth_client

import (
	"errors"
	"fmt"
	"os"
	"time"
	"todo-app-go/domain/auth"

	"github.com/golang-jwt/jwt/v5"
)

type AuthClient struct{} //状態を持たない

func NewAuthClient() auth.IAuthClient {
	return &AuthClient{}
}

// JWTトークン生成
func (a *AuthClient) GenerateToken(userID string) (string, error) {
	jwtSecret := []byte(os.Getenv("JWT_SECRET")) //環境変数から秘密鍵を取得
	claims := jwt.MapClaims{                     //トークンの中身を作成
		"sub": fmt.Sprintf("%v", userID),
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims) //署名方式の設定
	return token.SignedString(jwtSecret)                       //秘密鍵をつかって署名し、トークンを生成
}

// トークン検証
func (a *AuthClient) VerifyToken(tokenString string) (string, error) {
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))                                       //環境変数から秘密鍵を取得
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) { //トークン解析
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return "", errors.New("ログインが必要です")
	}

	// トークンから userID を取得
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if sub, ok := claims["sub"].(string); ok {
			return sub, nil // userID を返す
		}
	}

	return "", errors.New("ログインが必要です")
}
