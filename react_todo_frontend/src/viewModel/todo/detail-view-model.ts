//detail
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTodoDetail, Todo } from "../../infrastructure/todo-api";
import { toast } from 'react-toastify';

export const useTodoDetailViewModel = () => {
  type LoadStatus = "loading" | "success" | "notfound";

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loginChecked, setLoginChecked] = useState(false);
  const [status, setStatus] = useState<LoadStatus>("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("ログインが必要です");
      router.push("/login");
      return;
    }else{
      setLoginChecked(true);
    }

    
  const fetchTodo = async () => {
    try {
      const data = await getTodoDetail(id, token);

      if (!data) {
        setStatus("notfound");
        return;
      }

      setTodo(data);
      setStatus("success");
    } catch (err) {
      setStatus("notfound");
      toast.error("タスクの取得に失敗しました");
    }
  };


    fetchTodo();
  }, [id, router]);

  // ログアウト実行
  const confirmLogout = () => {
    setLoginChecked(false);
    toast.success("ログアウトしました");
    localStorage.removeItem("token");
    router.push("/login");
  };

  // ログインページへ遷移
  const confirmLogin = () => {
    router.push("/login"); 
  };

  return {
    todo,
    loginChecked,
    confirmLogout,
    confirmLogin,
    status,
    };
  }
