//delete
"use client";

import LoadingSpinner from "@/src/components/ui/loadingSpinner";
import { useDeleteViewModel } from "../../../../viewModel/todo/delete-view-model";
import { useRouter } from "next/navigation";

export default function DeleteTodoPage() {
  const {
    todo,
    deleting,
    handleDelete,
    status,
  } = useDeleteViewModel();

  const router = useRouter();
  if (status === "loading") {
    return <LoadingSpinner />; // ← ぐるぐる
  }

  if (status === "notfound" || !todo) {
    return (
      <p style={{ 
          inset: 0,  
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          zIndex: 9999,
          fontSize: "18px" }}>
        タスクが見つかりませんでした
      </p>
    );
  }


  return (
    <>
      <div>
        <h1 style={{fontSize:'22px', textAlign:'center', margin:'30px 0 20px 0'}}>タスク削除確認</h1>

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