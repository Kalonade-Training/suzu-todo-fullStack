//update
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateTodo, getTodoDetail, Todo } from "../../../../features/todo_api"; // getTodoDetailをインポート

export default function TodoDetailPage() {
  const router = useRouter(); 
  const params = useParams();
  const id = params.id as string;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
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
        const data = await getTodoDetail(id, token); // APIからTodoを取得
        setTodo(data);
        setTitle(data.title);
        setBody(data.body);
        setDueDate(data.dueDate || "");
        setIsCompleted(data.isCompleted);
      } catch (err: any) {
        setMessage("タスクの取得に失敗しました: " + err.message);
        console.error("Failed to fetch todo:", err);
      } finally {
        setLoading(false); // ローディング終了
      }
    };

    fetchTodo();
  }, [token, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage("ログインが必要です");
      return;
    }

    try {
      const updatedTodo = await updateTodo(id, token, {
        title,
        body,
        dueDate,
        isCompleted,
      });
      setMessage("更新成功！");
      setTodo(updatedTodo);
      router.push(`/todos`); // 一覧ページに戻る
      router.refresh(); // キャッシュをクリア
      console.log("Todo updated:", updatedTodo);
    } catch (err: any) {
      setMessage("更新失敗: " + err.message);
      console.error("Failed to update todo:", err);
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
        <h1 style={{fontSize:'22px', textAlign:'center', margin:'30px 0 20px 0'}}>タスク編集</h1>
        <div className="todo-item" style={{width:'80%', flexDirection:'column',margin:'0 auto'}}>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit} className="form">
          <div className="input">
            <label>タイトル：</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
               style={{
                            width: '100%',
                            padding: '12px 44px 12px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '16px',
                            outline: 'none',
                            transition: 'all 0.2s',
                            boxSizing: 'border-box',
                        }}
              required
            />
          </div>
          <div className="textarea">
            <label>本文：</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
               style={{
                            width: '500px',
                            padding: '12px 44px 12px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '16px',
                            outline: 'none',
                            transition: 'all 0.2s',
                            boxSizing: 'border-box',
                        }}
              required
            />
          </div>
          <div className="inputdate">
            <label className="label">期限：</label>
            <input
              className="date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="checkbox">
            <label className="label">完了状態：</label>
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
            />
            <span>{isCompleted ? "✅ 完了" : "❌ 未完了"}</span>
          </div> 
        
          <div style={{display:'flex',gap:'100px', marginTop:'20px'}}>
            <button type="submit" className="button">更新する</button>
            <button className="button" onClick={() => router.push("/todos")}>
              一覧に戻る
            </button>
          </div>
       </form>
        </div>
        
      </div>
    </>
  );
}