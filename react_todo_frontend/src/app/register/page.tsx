//register
"use client"

import {useState} from "react"
import { registerUser } from "../../features/user_api"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail} from 'lucide-react';

export default function Register(){
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async(e: React.FormEvent) => {
        e.preventDefault();

        //入力を登録
        try{
            const newUser = await registerUser({
                email,
                password,
            });

            

            if(!newUser){
                setMessage("ログイン失敗")
                //入力リセット
                setEmail("");
                setPassword("");
                return;
            }
            //入力リセット
            setEmail("");
            setPassword("");
            
            setMessage(`作成成功！ID：${newUser.id}`);
            router.push("/login"); // loginページに遷移

        }catch(err:any){
            setMessage(err.message)
            console.log("failed to create user");
        }
    };

    return(
        <>
            <header>
                <h1>TODO管理アプリ</h1>
            </header>

            <div>
               

                {/** 新規登録フォーム */}
                <div style={{ 
                    border: "2px solid #f94fa1f4", 
                    borderRadius: "8px",
                    backgroundColor: "#fbfafaf4",
                    margin:"20px auto",
                    width:"60%"
                }}> 
                <div style={{backgroundColor:"#f94fa1f4", color:"white",padding:"15px"}}>
                    <h1 style={{paddingTop:0, color:'white',fontSize:'23px'}}>新規登録</h1>
                    <p style={{ fontSize:"15px"}}>アカウントを登録して始めましょう。</p>
                </div>
                    <form onSubmit ={handleRegister}>
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
                                value = {email}
                                onChange = {(e) =>setEmail(e.target.value)}
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
                            <label className="label" >パスワード</label>
                             <div style={{ position: 'relative', display: 'inline-block', width: '100%', margin:'0 auto' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
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
                            <p style={{ fontSize: '12px', color: '#6b7280'}}>
                                8文字以上の安全なパスワードを設定してください
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="button"
                            style={{ backgroundColor: "#f14699f4" }}
                        >
                            新規作成
                        </button>

                    </form>
                </div>
                {message && <p className = "message">{message}</p>}
            </div>
        </>
    )
}