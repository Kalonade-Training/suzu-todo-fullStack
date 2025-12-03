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
export const getTodos = async (token: string): Promise<Todo[]> => {
    const res = await fetch(`${API_URL}/todos`
, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store', // キャッシュを無効化
    }
    );

    const text = await res.text();
    console.log('ステータス:', res.status);
    console.log('レスポンス:', text);

    if (!res.ok) {
       // JSONかどうかを安全にチェック
        try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.error || "Failed to fetch TODO");
        } catch {
            throw new Error(`API Error: ${res.status} - ${text.substring(0, 100)}`);
        }
    }

    const data = JSON.parse(text);
    //修正：nullの場合は空の配列にする
    return Array.isArray(data.todos) ? data.todos : [];
}

// Todo作成API
export const createTodo = async (token: string, todo: Omit<Todo, 'id' | 'user_id' | 'isCompleted' | 'createdAt' | 'updatedAt'>): Promise<Todo> => { 
    const res = await fetch(`${API_URL}/todos/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            title: todo.title,
            body: todo.body,
            due_date: todo.dueDate,
        }),
    });
    if (!res.ok) {
        const errorData = await res.json(); 
        throw new Error(errorData.error || "Failed to create TODO");
    }
    return res.json();
}

// Todo更新API
export const updateTodo = async (id: string, token: string, todo: Partial<Omit<Todo, 'id' | 'user_id' | 'createdAt' | 'updatedAt'>>): Promise<Todo> => {
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
        throw new Error(errorData.error || "Failed to update TODO");
    }
    return res.json();
}

// Todo削除API
export const deleteTodo = async (id: string, token: string): Promise<void> => {
    const res = await fetch(`${API_URL}/todos/${id}/delete`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) {
       const errorData = await res.json(); 
        throw new Error(errorData.error || "Failed to delete TODO");
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
        throw new Error(errorData.error || "Failed to duplicate TODO");
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
        throw new Error(errorData.error || "Failed to get detail TODO"); 
    }

    // JSONデータを取得
    const data = await res.json(); 
    
    // ログで確認した構造に合わせて、Todoオブジェクトを抽出する
    const todoData = data.todo; 

    // 抽出したデータを返却
    if (!todoData) {
        throw new Error("Todo data is missing from the response body.");
    }
    
    return todoData; 
}

// 日付フォーマット関数
export const formatDateTime = (isoString: string): string => {
  if (!isoString) return "";

  const date = new Date(isoString);

  const Y = date.getFullYear();
  const M = String(date.getMonth() + 1).padStart(2, "0");
  const D = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");

  return `${Y}/${M}/${D} ${h}:${m}`;
};