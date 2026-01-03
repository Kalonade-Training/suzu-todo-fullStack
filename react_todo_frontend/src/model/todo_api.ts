import { validation, searchValidation } from "../viewModel/value-object/validation";

//API通信を行う関数
export interface Todo {
  id: string;
  user_id: string;
  title: string;
  body: string;
  dueDate: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
// APIのベースURL
const API_URL = 'http://localhost:8080';

// Todo取得API
export const getTodos = async (token: string): Promise<Todo[]> => { //async:非同期関数（awaitが使える）、Promise:必ずこの形で返すという約束
    const res = await fetch(`${API_URL}/todos` //この処理が完了するまで待つ
, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,//認証ヘッダー（自身の身元や権限をサーバーに証明するためのHTTPヘッダー情報）
        },
        cache: 'no-store', // キャッシュを無効化
    }
    );

    const text = await res.text();//レスポンスの本文をテキスト形式で取得（デバックのため）
    console.log('ステータス:', res.status);
    console.log('レスポンス:', text);

    if (!res.ok) {
       // JSONかどうかを安全にチェック
        try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.error || "タスクを取得できませんでした");//JSONとして解析できた場合、エラーメッセージを抽出
        } catch {
            throw new Error(`API Error: ${res.status} - ${text.substring(0, 100)}`);
        }
    }
   
    const data = JSON.parse(text);//JSON形式に変換
    //修正：nullの場合は空の配列にする
    return Array.isArray(data.todos) ? data.todos : [];//todos配列を返す
}

// Todo作成API
export const createTodo = async (token: string, todo: Omit<Todo, 'id' | 'user_id' | 'isCompleted' | 'createdAt' | 'updatedAt'>): Promise<Todo> => {  //omit:指定したプロパティを除外した型を作成
    // バリデーション
    const error = validation(todo.title, todo.body);
    if (error) {
        throw new Error(error);
    } 
    const res = await fetch(`${API_URL}/todos/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',//JSON形式でデータを送信することを宣言
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ //JSON文字列に変換
            title: todo.title,
            body: todo.body,
            due_date: todo.dueDate,
        }),
    });
    if (!res.ok) {
        const errorData = await res.json(); 
        throw new Error(errorData.error || "タスクの作成に失敗しました");
    }
    
    return res.json();
}

// Todo更新API
export const updateTodo = async (id: string, token: string, todo: Partial<Omit<Todo, 'id' | 'user_id' | 'createdAt' | 'updatedAt'>>): Promise<Todo> => { //Partial:Omit以外のプロパティも任意で更新可能
    // バリデーション
    const error = validation(todo.title || "", todo.body || "");
    if (error) {
        throw new Error(error);
    }
    const res = await fetch(`${API_URL}/todos/${id}/update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            title: todo.title,
            body: todo.body,
            due_date: todo.dueDate,
            completedAt: todo.isCompleted,
        }),
    });
    if (!res.ok) {
        const errorData = await res.json(); 
        throw new Error(errorData.error || "タスクの更新に失敗しました");
    }
    
    return res.json();
}

// Todo削除API
export const deleteTodo = async (id: string, token: string): Promise<void> => { //削除したかどうかのみ重要なのでvoidで戻り値なし
    const res = await fetch(`${API_URL}/todos/${id}/delete`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) {
       const errorData = await res.json(); 
        throw new Error(errorData.error || "タスクの削除に失敗しました");
    }
    return;
}

// Todo複製API
export const duplicateTodo = async (id: string, token: string): Promise<Todo> => {
    const res = await fetch(`${API_URL}/todos/${id}/duplicate`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) {
       const errorData = await res.json(); 
        throw new Error(errorData.error || "タスクの複製に失敗しました");
    }
    return res.json();
}

// Todo詳細取得API
export const getTodoDetail = async (id: string, token: string): Promise<Todo> => {
    const res = await fetch(`${API_URL}/todos/${id}/detail`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }); 
    if (!res.ok) {
        // エラー処理
        const errorData = await res.json(); 
        throw new Error(errorData.error || "タスクの詳細取得に失敗しました"); 
    }

    // JSONデータを取得
    const data = await res.json(); 
    
    // ログで確認した構造に合わせて、Todoオブジェクトを抽出する
    const todoData = data.todo; 

    
    if (!todoData) {
        throw new Error("タスクデータが存在しません");
    }
    
    return todoData; 
}

// 日付フォーマット関数
export const formatDateTime = (isoString: string): string => {
  if (!isoString) return "";

  const date = new Date(isoString);

  const Y = date.getFullYear();
  const M = String(date.getMonth() + 1).padStart(2, "0"); //+1で0-11を1-12に変換、padStartで2桁に、足りない場合は先頭に0を追加
  const D = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");

  return `${Y}/${M}/${D} ${h}:${m}`;
};