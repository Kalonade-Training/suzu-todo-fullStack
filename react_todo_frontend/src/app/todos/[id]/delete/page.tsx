//delete
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { deleteTodo, getTodoDetail, Todo } from "../../../../features/todo_api";

export default function DeleteTodoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  // 認証チェック
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.push("/login");
      return;
    }
    setToken(t);
  }, [router]);

  // Todoデータを取得
  useEffect(() => {
    const fetchTodo = async () => {
      if (!token || !id) return;

      try {
        const data = await getTodoDetail(id, token);
        setTodo(data);
      } catch (err: any) {
        setMessage("タスクの取得に失敗しました: " + err.message);
        console.error("Failed to fetch todo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [token, id]);

  const handleDelete = async () => {
    if (!token) {
      setMessage("ログインが必要です");
      return;
    }

    setDeleting(true);
    try {
      await deleteTodo(id, token);
      setMessage("削除成功！");
      setTimeout(() => {
        router.push("/todos");
      }, 1000);
    } catch (err: any) {
      setMessage("削除失敗: " + err.message);
      console.error("Failed to delete todo:", err);
      setDeleting(false);
    }
  };

  
  if (loading) return <p>読み込み中…</p>;
  if (!todo) return <p>タスクが見つかりませんでした。</p>;

  return (
    <>
      <header>
        <h1>TODO管理アプリ</h1>
      </header>

      <div>
        <h1 style={{fontSize:'22px', textAlign:'center', margin:'30px 0 20px 0'}}>タスク削除確認</h1>
        {message && <p className="message">{message}</p>}

        <div style={{ 
          border: "2px solid #ff4444", 
          padding: "20px", 
          borderRadius: "8px",
          marginBottom: "20px",
          backgroundColor: "#fff5f5",
          width:"80%",
          margin:"0 auto"
        }}>
          <h2 style={{ color: "#ff4444", marginBottom: "16px" }}>
            以下のタスクを削除しますか？
          </h2>
          <div style={{ marginBottom: "12px" }}>
            <strong>タイトル:</strong> {todo.title}
          </div>
          <div className="detail-body" style={{ marginBottom: "12px" }}>
            <strong>本文:</strong> {todo.body}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <strong>期限:</strong> {todo.dueDate || "なし"}
          </div>
          <div>
            <strong>完了状態:</strong> {todo.isCompleted ? "✅ 完了" : "❌ 未完了"}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button 
            className="button" 
            onClick={handleDelete}
            disabled={deleting}
            style={{
              backgroundColor: deleting ? "#ccc" : "#ff4444",
              cursor: deleting ? "not-allowed" : "pointer"
            }}
          >
            {deleting ? "削除中..." : "削除する"}
          </button>
          <button 
            className="button" 
            onClick={() => router.push(`/todos/${todo.id}/detail`)}
            disabled={deleting}
            style={{
              backgroundColor: deleting ? "#ccc" : "#666",
              cursor: deleting ? "not-allowed" : "pointer"
            }}
          >
            キャンセル
          </button>
        </div>
      </div>
    </>
  );
}