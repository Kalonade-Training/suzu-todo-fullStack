//delete
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { deleteTodo, getTodoDetail, Todo } from "../../model/todo_api";
import { toast } from 'react-toastify';

export const useDeleteViewModel = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [token, setToken] = useState("");
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
    }
  };

    fetchTodo();
  }, [id,router]);

  const handleDelete = async () => {
    if (!token) {
      toast.warning("ログインが必要です");
      return;
    }

    setDeleting(true);
    try {
      await deleteTodo(id, token);
      toast.success("削除成功！");
      setTimeout(() => {
        router.push("/todos");
      }, 1000);
    } catch (err: any) {
      toast.error(err.message);
      console.error("Failed to delete todo:", err);
      setDeleting(false);
    }
  };

    return{
        todo,
        deleting,
        handleDelete,
        status,
    };
};
