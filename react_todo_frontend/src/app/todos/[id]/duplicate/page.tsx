//duplicate
"use client";

import LoadingSpinner from "@/src/components/ui/loadingSpinner";
import { useDuplicateViewModel } from "../../../../viewModel/todo/duplicateViewModel";
import { useRouter} from "next/navigation";

export default function DuplicateTodoPage() {
  const { todo, duplicating, handleDuplicate, status } = useDuplicateViewModel();
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
        <h1  style={{fontSize:'22px', textAlign:'center', margin:'30px 0 20px 0'}}>タスク複製確認</h1>

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