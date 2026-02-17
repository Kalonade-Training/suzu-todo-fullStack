"use client";

import { LogOut,User } from "lucide-react";
import { useTodoListViewModel } from "@/src/viewModel/todo/todo-view-model";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function TodosLayout({ children }: { children: React.ReactNode }) {
  const {email, loginChecked, confirmLogout, confirmLogin } = useTodoListViewModel();
  const router = useRouter();

  const handleLogout = () => {
    // ログアウト確認ダイアログ（View層で処理）
     toast.info(
      <div style={{ padding: "8px 4px" }}>
        <p style={{
          fontSize: "15px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "10px",
          textAlign: "center",
        }}>
          ログアウトしますか？
        </p>
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "14px",
        }}>
          <button
            onClick={() => {
              toast.dismiss();
              confirmLogout();
            }}
            style={{
              minWidth: "80px",
              padding: "4px 0",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              minWidth: "80px",
              padding: "4px 0",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };
  const jumpTodos = () => {
    router.push("/todos");
  };  
  return (
    <>
      {/* ヘッダー */}
      <header className="header">
        <h1 
          className="title"
          onClick={jumpTodos}
        >TODO管理アプリ</h1>

        {loginChecked ? (
          <div className="right">
            <User size={20} />
            <p className="email">{email}</p>
          
          <button
            onClick={handleLogout}
            aria-label="ログアウト"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            <LogOut size={20} />
          </button>
        </div>
        ):(
          <button
            onClick={confirmLogin}
            aria-label="ログイン"
            style={{
              display: "flex",
              alignItems: "center",
              padding: '12px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: "0 6px 16px rgba(79, 70, 229, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            ログイン
          </button>
        )}
        
      </header>

      {children}
    </>
  );
}
