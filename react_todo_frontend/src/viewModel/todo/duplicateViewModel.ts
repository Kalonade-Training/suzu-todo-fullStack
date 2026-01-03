//duplicate
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { duplicateTodo, getTodoDetail, Todo } from "../../model/todo_api";
import { toast } from 'react-toastify';

export const useDuplicateViewModel = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [todo, setTodo] = useState<Todo | null>(null); 
  const [duplicating, setDuplicating] = useState(false);
  const [token, setToken] = useState("");
  const [ status, setStatus] = useState<"loading" | "success" | "notfound">("loading");

  // 認証チェック
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("ログインが必要です");
      router.push("/login");
      return;
    }

    setToken(token);

  // Todoデータを取得
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
    fetchTodo(); //関数実行
  }, [id,router]); //useEffectはtokenかidが変わったら再実行(変わるまでは実行しないため無限ループ防止)

  const handleDuplicate = async () => {
    if (!token) {
      toast.warning("ログインが必要です");
      return;
    }

    setDuplicating(true);
    try {
      await duplicateTodo(id, token);
      toast.success("複製成功！");
      setTimeout(() => {
        router.push("/todos");
      }, 1000);
    } catch (err: any) {
      toast.error(err.message);
      console.error("Failed to duplicate todo:", err);
      setDuplicating(false);
    }
  };

  return {
    todo,
    duplicating,
    handleDuplicate,
    status,
  };
}