//detail
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { formatDateTime,getTodoDetail, Todo } from "../../../../features/todo_api";
import { Pencil, Trash, Copy } from "lucide-react";

export default function TodoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTodo = async () => {
        setLoading(true);
      try {
        const data = await getTodoDetail(id,token);
        setTodo(data);
        console.log("Todo set:", data);
      } catch (err) {
        console.error("Failed to fetch todo detail", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id, router]);

  if (loading) return <p>読み込み中…</p>;
  if (!todo) return <p>タスクが見つかりませんでした。</p>;

  return (
    <>
        <header>
                <h1>TODO管理アプリ</h1>
        </header>

            <div>
                <h1 style={{fontSize:'22px', textAlign:'center', margin:'30px 0 10px 0'}}>タスク詳細</h1>
                <div className="todo-item" style={{display: 'flex',flexDirection: 'column', width:'80%', margin:'0 auto'}}>
                  <div>
                    <button className="buttonlighter" onClick={() => router.push(`/todos/${todo.id}/update`)}><Pencil /></button>
                    <button className="buttonlighter" onClick={() => router.push(`/todos/${todo.id}/delete`)}><Trash/></button>
                    <button className="buttonlighter" onClick={() => router.push(`/todos/${todo.id}/duplicate`)}><Copy/></button>
                    <h2 className="title">{todo.title}</h2>
                  </div>
                  <div className="content">
                    <p className="detail-body">{todo.body}</p>
                    <p>期限: {todo.dueDate}</p>
                    <p>完了: {todo.isCompleted ? "✅" : "❌"}</p>
                    <p>作成日時：{formatDateTime(todo.createdAt)}</p>
                    <p>最終更新：{formatDateTime(todo.updatedAt)}</p>
                  </div>
                 </div>
                <button className="button" onClick={() => router.push("/todos")}>
                  一覧に戻る
                </button>
      </div>
    </>
  );
}
