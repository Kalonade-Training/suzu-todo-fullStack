//API通信を行う関数
export interface LoginRequest {
 id: string; 
 email: string; 
 password: string; 
 createdAt: string; 
 updatedAt: string;
}

export interface RegisterRequest {
  id: string; 
  email: string; 
  password: string; 
  createdAt: string; 
  updatedAt: string;
}

export type RegisterResponse = {
  id: string;
  email: string;
  token: string;
};

export type LoginResponse = {
  token: string;
  email: string;
};


const API_URL = 'http://localhost:8080';

export const registerUser = async(user: Omit<RegisterRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<RegisterResponse | null> => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',//JSON形式で送信することを宣言
        },
        body: JSON.stringify(user),//引数をJSONデータに変換して送信→サーバー側で受け取り処理されてtokenが追加されたRegusterRespinseの形で返却
    });

    if (!res.ok) {
       const errorData = await res.json(); 
        throw new Error(errorData.error || "ユーザー登録に失敗しました"); 
    }
    return res.json();
}   

export const loginUser = async (user: Omit<LoginRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<LoginResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    }); 
    if (!res.ok) {
        const errorData = await res.json(); 
        throw new Error(errorData.error || "ログインに失敗しました");
    }
    return await res.json();
}
