//バリデーション（検索用）
export const KeywordVO = (keyword: string): string => {
    if (keyword.length > 50) {
        throw new Error("キーワードは50文字以下で入力してください");
    }
    return keyword; //エラーなし
}