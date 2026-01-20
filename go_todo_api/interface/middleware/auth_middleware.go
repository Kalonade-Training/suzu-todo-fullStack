package middleware

import (
	"net/http"
	"strings"
	"todo-app-go/domain/auth"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(authClient auth.IAuthClient) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization") //トークン取得
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "ログインが必要です"})
			return
		}

		token = strings.TrimPrefix(token, "Bearer") //bearer部分削除
		token = strings.TrimSpace(token)

		userID, err := authClient.VerifyToken(token) //verify tokenで検証
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "ログインが必要です"})
			return
		}
		//有効ならハンドラーへ保存
		c.Set("userID", userID)
		c.Next()
	}
}
