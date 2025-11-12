package auth

// IAuthClient は認証トークンを扱うインターフェース
type IAuthClient interface {
	// トークンを生成
	GenerateToken(userID string) (string, error)

	// トークンを検証し、userIDを返す
	VerifyToken(tokenString string) (string, error)
}
