// middleware/error_handler.go
package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

// エラーメッセージマップ
var errorMessages = map[string]string{
	"record not found":               "データが見つかりません",
	"duplicate key value":            "重複するデータが存在します",
	"invalid input syntax":           "入力形式が不正です",
	"foreign key constraint":         "関連するデータが存在します",
	"not null constraint":            "必須項目が入力されていません",
	"unique constraint":              "一意制約違反です",
	"jwt token missing":              "認証トークンがありません",
	"jwt token invalid":              "認証トークンが無効です",
	"unauthorized":                   "認証が必要です",
	"forbidden":                      "アクセス権限がありません",
	"bad request":                    "リクエストが不正です",
	"internal server error":          "サーバーエラーが発生しました",
	"email or password is incorrect": "メールアドレスまたはパスワードが間違っています",
	"email already exists":           "このメールアドレスは既に登録されています",
}

// フィールド名の日本語マップ
var fieldNameMap = map[string]string{
	"Email":    "メールアドレス",
	"Password": "パスワード",
	"Title":    "タイトル",
	"Body":     "本文",
	"DueDate":  "期限",
}

// バリデーションタグの日本語メッセージ
var validationMessageMap = map[string]string{
	"required": "%sは必須です",
	"email":    "%sの形式が正しくありません",
	"min":      "%sは%s文字以上である必要があります",
	"max":      "%sは%s文字以下である必要があります",
	"gte":      "%sは%s以上である必要があります",
	"lte":      "%sは%s以下である必要があります",
	"len":      "%sは%s文字である必要があります",
	"oneof":    "%sは指定された値のいずれかである必要があります",
}

// エラーレスポンス構造体
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
	Code    int    `json:"code"`
}

// グローバルエラーハンドラー
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next() // 次のハンドラーを実行

		// エラーが発生している場合
		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err

			// バリデーションエラーかチェック
			if validationErrs, ok := err.(validator.ValidationErrors); ok {
				message := translateValidationError(validationErrs)
				c.JSON(http.StatusBadRequest, ErrorResponse{
					Error:   "Validation Error",
					Message: message,
					Code:    http.StatusBadRequest,
				})
				return
			}

			// 通常のエラー処理
			originalMsg := err.Error()
			japaneseMsg := translateError(originalMsg)

			// ステータスコードの取得（デフォルトは500）
			statusCode := c.Writer.Status()
			if statusCode == http.StatusOK {
				statusCode = http.StatusInternalServerError
			}

			c.JSON(statusCode, ErrorResponse{
				Error:   originalMsg,
				Message: japaneseMsg,
				Code:    statusCode,
			})
			return
		}
	}
}

// バリデーションエラーを日本語に変換
func translateValidationError(validationErrs validator.ValidationErrors) string {
	var messages []string

	for _, fieldErr := range validationErrs {
		// フィールド名を日本語に変換
		fieldName := fieldErr.Field()
		if jpName, exists := fieldNameMap[fieldName]; exists {
			fieldName = jpName
		}

		// バリデーションタグを取得
		tag := fieldErr.Tag()
		param := fieldErr.Param()

		// メッセージを生成
		var message string
		if msgTemplate, exists := validationMessageMap[tag]; exists {
			if param != "" {
				message = formatMessage(msgTemplate, fieldName, param)
			} else {
				message = formatMessage(msgTemplate, fieldName)
			}
		} else {
			message = fieldName + "の入力が不正です"
		}

		messages = append(messages, message)
	}

	return strings.Join(messages, "、")
}

// エラーメッセージを日本語に変換
func translateError(errMsg string) string {
	// 完全一致を探す
	if msg, ok := errorMessages[errMsg]; ok {
		return msg
	}

	// 部分一致を探す（大文字小文字を無視）
	errMsgLower := strings.ToLower(errMsg)
	for key, value := range errorMessages {
		if strings.Contains(errMsgLower, strings.ToLower(key)) {
			return value
		}
	}

	// マッチしない場合はデフォルトメッセージ
	return "エラーが発生しました"
}

// メッセージのフォーマット（可変長引数対応）
func formatMessage(template string, args ...interface{}) string {
	// Go 1.18+の場合、stringsパッケージを使う
	result := template
	for _, arg := range args {
		result = strings.Replace(result, "%s", arg.(string), 1)
	}
	return result
}
