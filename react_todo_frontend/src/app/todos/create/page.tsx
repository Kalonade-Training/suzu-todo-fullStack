//create
"use client";

import LoadingSpinner from "@/src/components/ui/loadingSpinner";
import { useCreateViewModel } from "../../../viewModel/todo/createViewModel";
import {useRouter} from "next/navigation"

export default function CreateTodo() {
  const router = useRouter();

  const {
    title,
    setTitle,
    body,
    setBody,
    dueDate,
    setDueDate,
    handleSubmit,
    status,
  } = useCreateViewModel();

  if (status === "loading") {
    return <LoadingSpinner />; // ぐるぐる
  }



  return(
    <>  
      <div>
        <h1  style={{fontSize:'22px', marginTop:'30px',textAlign:'center'}}>TODO作成</h1>

        {/** Todo登録・handleSubmit呼び出し*/}
        <div className="todo-item">
        <form onSubmit={handleSubmit} className="form">
          <div className="input">
            <label className="label">タイトル：</label>
            <input 
              value = {title}
              onChange = {(e) =>setTitle(e.target.value)}
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
            <label className= "label">本文：</label>
            <textarea 
              value = {body}
              onChange = {(e) => setBody(e.target.value)}
              style={{
                        width: '100%',
                        height: '120px',
                        padding: '12px',
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
          
          <div className="button-space">
            <button
              type="submit"
              className="button"
            >
              作成
            </button>
            <button type="button" className="button" onClick={() => router.push("/todos")}>
                    一覧に戻る
            </button>
          </div>
       </form> 
       
      
      </div> 
      </div>
    </>
  );
}


