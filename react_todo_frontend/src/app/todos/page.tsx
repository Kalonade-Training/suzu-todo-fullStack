//一覧ページ
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTodos, Todo } from "../../features/todo_api";
import { Plus } from "lucide-react";

export default function TodoListPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  //getTodosですぐにタスクすべて呼び出し
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTodos = async () => {
      setLoading(true); // 再読み込み時もローディング表示
      try {
        const data = await getTodos(token);
        console.log('Fetched todos:', data); // デバッグ用
        setTodos(data);
      } catch (err) {
        console.error("Failed to fetch todos", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [router]);

  if (loading){ return <p>読み込み中…</p>;}

  return (
    <>
        <header>
          <h1>TODO管理アプリ</h1>
        </header>

        
         <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '15px'
        }}> 
        {todos.length > 0 && (
          <>
          <h1 style={{ fontSize: '22px', margin: '30px 0 10px 20px' }}>
            タスク一覧
          </h1>
          
         
            <button
              onClick={() => router.push("/todos/create")}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#4f46e5',
                color: 'white',
                padding: '12px 20px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)',
                marginRight: '20px'
              }}
            >
              <Plus style={{ width: '20px', height: '20px' }} />
              新規タスクを作成
            </button>
         </> )}
        </div>
        {todos.length === 0 ? (
            <>
                <p className = "text-align">タスクはまだありません</p>
                <button className = "button" >
                    <a href="/todos/create" >新規タスクをさっそく作る！</a>
                </button>
            </>
        ) : (
            <ul>
            {todos.map(todo => (
                <li className="todo-item" key={todo.id} onClick={() => router.push(`/todos/${todo.id}/detail`)}>
                <h2 className="todo-title">{todo.title}</h2>
                <p className="todo-body">{todo.body}</p>
                <p className="todo-dueDate">期限: {todo.dueDate}</p>
                <p className="todo-completed">完了: {todo.isCompleted ? "✅" : "❌"}</p>
                </li>
            ))}
            </ul>
        )}
        
    </>
  );
}
