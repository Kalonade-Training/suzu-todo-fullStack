package middleware

import (
	"net/http"
	"todo-app-go/domain/auth"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(authClient auth.IAuthClient) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization") //トークン取得
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token required"})
			return
		}

		userID, err := authClient.VerifyToken(token) //verify tokenで検証
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}
		//有効ならハンドラーへ保存
		c.Set("userID", userID)
		c.Next()
	}
}
