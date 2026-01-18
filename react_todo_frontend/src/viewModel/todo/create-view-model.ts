//create
import { useEffect, useState } from "react";
import { 
  createTodo
} from "../../infrastructure/todo-api";
import {useRouter} from "next/navigation"
import { toast } from 'react-toastify';
import { TitleVO } from "../../domain/value-object/TitleVO";
import { BodyVO } from "../../domain/value-object/BodyVO";


export const useCreateViewModel = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const[body ,setBody] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
  const[token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState< "loading" | "success">("loading");

//認証チェック
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("ログインが必要です");
      router.push("/login");
      return;
    }
    
   setToken(token);
   setStatus("success"); 
  },[router]); //ページ読み込み時に一度だけ実行

  //Todo作成処理
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.warning("ログインが必要です");
      return;
    }
    setStatus("loading");
    
    

    try{
      //バリデーション
      const titleVO =  TitleVO(title);
      const bodyVO = BodyVO(body);

      const newTodo = await createTodo(token,{
        title: titleVO,
        body: bodyVO,
        dueDate,//formからonchangeで取得した文字列をそのまま渡す
      });
      toast.success(`タスク作成成功！`);
      console.log(`Todo created with ID: ${newTodo.id}`);

      //入力リセット
      setTitle("");
      setBody("");
      setDueDate("");

      setStatus("success");
      router.push("/todos");

    }catch(err:any){
      toast.error(err.message);
      console.log("failed to create todo");
      setStatus("success");
    }
  };

 return {
    title,
    setTitle,
    body,
    setBody,
    dueDate,
    setDueDate,
    handleSubmit,
    status,
    };
 }