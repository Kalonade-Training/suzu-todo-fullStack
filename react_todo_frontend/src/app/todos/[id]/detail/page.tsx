//detail
"use client";

import { useTodoDetailViewModel } from "../../../../viewModel/todo/detail-view-model";
import { useRouter } from "next/navigation";
import { formatDateTime} from "../../../../infrastructure/todo-api";
import { Pencil, Trash, Copy } from "lucide-react";
import LoadingSpinner from "@/src/components/ui/loadingSpinner";

export default function TodoDetailPage() {
  const router = useRouter();
  const { todo, status } = useTodoDetailViewModel();


  if (status === "loading") {
    return <LoadingSpinner />; // ← ぐるぐる
  }

  if (status === "notfound" || !todo) {
    return (
      <>
        <p style={{ 
            inset: 0,  
            position: "fixed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            pointerEvents: "none",
          }}>
          タスクが見つかりませんでした
        </p>
      </>
    );
  }
  const handleDelete = () => {
    router.push(`/todos/${todo.id}/delete`);
  };

  const handleUpdate = () => {
    router.push(`/todos/${todo.id}/update`);
  };
  const handleDuplicate = () => {
    router.push(`/todos/${todo.id}/duplicate`);
  };


  return (
    <>
      <div>
          <h1 style={{fontSize:'22px', textAlign:'center', margin:'30px 0 10px 0'}}>タスク詳細</h1>
          <div className="todo-item" style={{display: 'flex',flexDirection: 'column', width:'80%', margin:'0 auto'}}>
            <div>
              <h2 className="title">{todo.title}</h2>
              <button className="buttonlighter" onClick={handleUpdate}><Pencil /></button>
              <button className="buttonlighter" onClick={handleDelete}><Trash/></button>
              <button className="buttonlighter" onClick={handleDuplicate}><Copy/></button>
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
