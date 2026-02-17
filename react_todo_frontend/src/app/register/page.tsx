//register
"use client"

import { Eye, EyeOff, Mail} from 'lucide-react';
import { useRegisterViewModel } from '../../viewModel/user/register-view-model';

export default function Register(){
  const {
    email,
    setEmail,
    password,   
    setPassword,
    showPassword,
    setShowPassword,
    handleRegister,
  } = useRegisterViewModel();
  

    return(
        <>
            <header>
                <h1>TODO管理アプリ</h1>
            </header>

            <div>
               

                {/** 新規登録フォーム */}
                <div  className="auth-card" style={{ border: "2px solid #f94fa1f4", }}> 
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
            </div>
            <div className = "text-align">
                        <a href="/login" >ログインはこちら</a>
        </div>
        </>
    )
}