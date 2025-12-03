//duplicate
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { duplicateTodo, getTodoDetail, Todo } from "../../../../features/todo_api";

export default function DuplicateTodoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [duplicating, setDuplicating] = useState(false);
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

  const handleDuplicate = async () => {
    if (!token) {
      setMessage("ログインが必要です");
      return;
    }

    setDuplicating(true);
    try {
      const duplicatedTodo = await duplicateTodo(id, token);
      setMessage("複製成功！");
      setTimeout(() => {
        router.push("/todos");
      }, 1000);
    } catch (err: any) {
      setMessage("複製失敗: " + err.message);
      console.error("Failed to duplicate todo:", err);
      setDuplicating(false);
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
        <h1  style={{fontSize:'22px', textAlign:'center', margin:'30px 0 20px 0'}}>タスク複製確認</h1>
        {message && <p className="message">{message}</p>}

        <div style={{ 
          border: "2px solid #4CAF50", 
          padding: "20px", 
          borderRadius: "8px",
          marginBottom: "20px",
          backgroundColor: "#f1f8f4",
          margin:"0 auto",
          width:"80%"
        }}>
          <h2 style={{ color: "#4CAF50", marginBottom: "16px" }}>
            以下のタスクを複製しますか？
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
          <p style={{ marginTop: "16px", color: "#666", fontSize: "14px" }}>
            ※ 複製されたタスクは未完了状態でコピーされます
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button 
            className="button" 
            onClick={handleDuplicate}
            disabled={duplicating}
            style={{
              backgroundColor: duplicating ? "#ccc" : "#4CAF50",
              cursor: duplicating ? "not-allowed" : "pointer"
            }}
          >
            {duplicating ? "複製中..." : "複製する"}
          </button>
          <button 
            className="button" 
            onClick={() => router.push(`/todos/${todo.id}/detail`)}
            disabled={duplicating}
            style={{
              backgroundColor: duplicating ? "#ccc" : "#666",
              cursor: duplicating ? "not-allowed" : "pointer"
            }}
          >
            キャンセル
          </button>
        </div>
      </div>
    </>
  );
}