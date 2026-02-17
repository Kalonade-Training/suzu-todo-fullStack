//update
"use client";

import LoadingSpinner from "@/src/components/ui/loadingSpinner";
import { useUpdateViewModel } from "../../../../viewModel/todo/update-view-model";
import { useRouter } from "next/navigation";

export default function TodoDetailPage() {
  const router = useRouter(); 
  const { todo,
    title,
    setTitle,
    body,
    setBody,
    dueDate,
    setDueDate,
    isCompleted,
    setIsCompleted,
    handleSubmit,
    updating,
    status
  } = useUpdateViewModel();
    
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

  const handletodo = () => {
    router.push(`/todos`);
  }
  
  return (
    <>
      <div>
        <h1 style={{fontSize:'22px', textAlign:'center', margin:'30px 0 20px 0'}}>タスク編集</h1>
        <div className="todo-item" style={{width:'80%', flexDirection:'column',margin:'0 auto'}}>
        
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
                        width: '100%',
                        height: '120px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '16px',
                        outline: 'none',
                        resize: 'vertical',
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
        
          <div className="button-space">
            <button type="submit" className="button" disabled={updating}>
              更新する
            </button>
            <button type="button" className="button" onClick={handletodo} disabled={updating} >
              一覧に戻る
            </button>
          </div>
       </form>
        </div>
        
      </div>
    </>
  );
}