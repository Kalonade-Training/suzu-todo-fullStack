//バリデーション
export const TitleVO = (title: string | null): string => {
    if (title === null || title.trim().length === 0 || title.length > 50) {
        throw new Error("タイトルは1文字以上50文字以下で入力してください");
    }
    return title; //エラーなし
}
