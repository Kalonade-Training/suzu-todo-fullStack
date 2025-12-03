//create
"use client";

import { useEffect, useState } from "react";
import { 
  createTodo
} from "../../../features/todo_api";
import {useRouter} from "next/navigation"

export default function CreateTodo() {
const router = useRouter();

  const [title, setTitle] = useState("");
  const[body ,setBody] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
  const [message, setMessage] = useState("");

  const[token, setToken] = useState<string | null>(null);

//認証チェック
  useEffect(()=>{
  const t = localStorage.getItem("token");
  if(!t){
    router.push("/login")
    // setMessage("ログインが必要です")
    return;
  }
  setToken(t);
  },[router]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage("ログインが必要です");
      return;
    }
    

    //入力を保存
    try{

      const newTodo = await createTodo(token,{
        title,
        body,
        dueDate,
      });
      setMessage(`作成成功！ID：${newTodo.id}`);

      //入力リセット
      setTitle("");
      setBody("");
      setDueDate("");

      router.push("/todos");

    }catch(err:any){
      setMessage(err.message)
      console.log("failed to create todo");
    }
  };

  return(
    <>  
      <header>
        <h1>TODO管理アプリ</h1>
      </header>

      <div>
        <h1  style={{fontSize:'22px', marginTop:'30px',textAlign:'center'}}>TODO作成</h1>

        {/** Todo登録・handleSubmit呼び出し*/}
        <div className="todo-item">
        <form onSubmit={handleSubmit} className="form">
          <div className="input">
            <label className="label">タイトル：</label>
            <input 
              className = ""
              value = {title}
              onChange = {(e) =>setTitle(e.target.value)}
               style={{
                            width: '500px',
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
            <label className= "label">本文：</label>
            <textarea 
              className=""
              value = {body}
              onChange = {(e) => setBody(e.target.value)}
              style={{
                            width: '500px',
                            padding: '12px 44px 12px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '16px',
                            outline: 'none',
                            transition: 'all 0.2s',
                            boxSizing: 'border-box',
                        }}
            />
          </div>

          <div className = "inputdate">
            <label className="label">期限：</label>
            <input 
              className="date"
              type = "date"
              value = {dueDate}
              onChange = {(e) =>setDueDate(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="button"
          >
            作成
          </button>
        </form>
       
       
      </div> 
      {message && <p className = "message">{message}</p>}
      </div>
    </>
  );
}


// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
