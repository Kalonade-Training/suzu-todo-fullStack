//login
"use client"

import {useState} from "react"
import { useRouter} from "next/navigation"
import {loginUser} from "../../features/user_api"
import { Eye, EyeOff, Mail} from 'lucide-react';

export default function Login(){
    const router = useRouter();

    const [email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    //ログイン処理
    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.token); // token 保存

      setMessage("ログイン成功！");
      //入力リセット
        setEmail("");
        setPassword("");
      router.push("/todos"); // TODO一覧ページに遷移
    } catch (err:any) {
      setMessage(err.message);
    }
  };



    return(
    <>
        <header>
            <h1>TODO管理アプリ</h1>
        </header>

        {/** ログインフォーム */}
        <div style={{ 
          border: "2px solid #8659f6ff", 
          borderRadius: "8px",
          backgroundColor: "#f7f5fbff",
          margin:"20px auto",
          width:"60%"
        }}>
            <div style={{backgroundColor:"#8659f6ff", color:"white",padding:"15px"}}>
                    <h2 style={{padding:0, color:'white'}}>ログイン</h2>
            </div>
            <form onSubmit = {handleLogin} className="form">
                <div className = "input">
                    <label className="label">メールアドレス</label>
                    <div style={{ position: 'relative', display: 'inline-block', width: '100%',margin:'0 auto' }}>
                        <Mail style={{ 
                            position: 'absolute', 
                            left: '12px', 
                            top: '40%', 
                            transform: 'translateY(-50%)',
                            width: '20px', 
                            height: '20px', 
                            color: '#9ca3af',
                            pointerEvents: 'none'
                        }} />
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 44px',
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
                </div>

                <div className = "input">
                    <label className="label">パスワード</label>
                    <div style={{ position: 'relative', display: 'inline-block', width: '100%', margin:'0 auto' }}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                        placeholder="••••••••"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '40%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        >
                        {showPassword ? (
                            <EyeOff style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                        ) : (
                            <Eye style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                        )}
                    </button>
                    </div>
                </div>

                <button type="submit" className="button">
                ログイン
                </button>
                
            </form>
        </div>
        <div className = "text-align">
                            <a href="/register" >新規登録はこちら</a>
        </div>
        {message && <p className="message">{message}</p>}
    </>
    );
}