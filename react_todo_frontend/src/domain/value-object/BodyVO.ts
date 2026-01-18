//バリデーション
export const BodyVO = (body: string | null): string => {
    if (body === null || body.trim().length === 0 || body.length > 100) {
        throw new Error("本文は1文字以上100文字以下で入力してください");
    }
    return body; //エラーなし
}