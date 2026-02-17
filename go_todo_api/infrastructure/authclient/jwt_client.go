package authclient

import (
	"errors"
	"os"
	"time"
	"todo-app-go/domain/auth"

	"github.com/golang-jwt/jwt/v5"
)

type AuthClient struct{}

func NewAuthClient() auth.IAuthClient {
	return &AuthClient{}
}

// JWTトークン生成
func (a *AuthClient) GenerateToken(userID string) (string, error) {
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	claims := jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// トークン検証
func (a *AuthClient) VerifyToken(tokenString string) (string, error) {
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return "", errors.New("invalid token")
	}

	// token.Claims を mapClaims として取得
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if sub, ok := claims["sub"].(string); ok {
			return sub, nil // userID を返す
		}
	}

	return "", errors.New("invalid token claims")
}
