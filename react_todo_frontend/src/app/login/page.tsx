//login
"use client"

import { Eye, EyeOff, Mail} from 'lucide-react';
import { useLoginViewModel } from "../../viewModel/user/loginViewModel";

export default function Login(){
    const {
    email,
    password,
    showPassword,
    setEmail,
    setPassword,
    setShowPassword,
    handleLogin,
  } = useLoginViewModel();

    return(
    <>
        <header>
            <h1>TODO管理アプリ</h1>
        </header>

        {/** ログインフォーム */}
        <div className="auth-card">
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
    </>
    );
}