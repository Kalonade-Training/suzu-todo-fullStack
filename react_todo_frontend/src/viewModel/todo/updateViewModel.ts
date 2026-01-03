//update
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateTodo, getTodoDetail, Todo } from "../../model/todo_api"; // getTodoDetailをインポート
import { toast } from 'react-toastify';
import { set } from "zod";

export const useUpdateViewModel = () => {
  const router = useRouter(); 
  const params = useParams();
  const id = params.id as string;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [token, setToken] = useState("");
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<"loading" | "success" | "notfound">("loading");

  // 認証チェック
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("ログインが必要です");
      router.push("/login");
      return;
    }

    setToken(token);
  }, [router]); //ページ読み込み時に一度だけ実行

  // Todoデータを取得
  useEffect(() => {
    const fetchTodo = async () => {
      if (!token || !id) return;

      try {
        const data = await getTodoDetail(id, token); // APIからTodoを取得
        if (!data) {
        setStatus("notfound");
        return;
      }
        setTodo(data);
        setTitle(data.title);
        setBody(data.body);
        setDueDate(data.dueDate || "");
        setIsCompleted(data.isCompleted);
        setStatus("success");
      } catch (err: any) {
        setStatus("notfound");
        toast.error("タスクの取得に失敗しました: " + err.message);
        console.error("Failed to fetch todo:", err);
      } 
    };

    fetchTodo();
  }, [token, id]); // tokenまたはidが変わったときに実行

  // フォーム送信処理

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.warning("ログインが必要です");
      return;
    }
    setUpdating(true);
    try {
      const updatedTodo = await updateTodo(id, token, {
        title,
        body,
        dueDate,
        isCompleted,//form内のonchangeで更新された値を送信
      });
      toast.success("更新成功！");
      setTodo(updatedTodo);
      router.push(`/todos`); // 一覧ページに戻る
      router.refresh(); // キャッシュをクリア
      console.log("Todo updated:", updatedTodo);
    } catch (err: any) {
      toast.error(err.message);
      setUpdating(false);
      console.error("Failed to update todo:", err);
    }
  };

    return {
        todo,
        title,
        setTitle,
        body,
        setBody,
        dueDate,
        setDueDate,
        isCompleted,
        setIsCompleted,
        updating,
        handleSubmit,
        status
    };
}