//バリデーション
export const validation = (title: string, body: string): string | null => {
    if (title.trim().length === 0 || title.length > 50) {
        return "タイトルは1文字以上50文字以下で入力してください";
    }
    if (body.trim().length === 0 || body.length > 100) {
        return "本文は1文字以上100文字以下で入力してください";
    }
    return null; //エラーなし
}

//バリデーション（検索用）
export const searchValidation = (keyword: string): string | null => {
    if (keyword.length > 50) {
        return "キーワードは50文字以下で入力してください";
    }
    return null; //エラーなし
}