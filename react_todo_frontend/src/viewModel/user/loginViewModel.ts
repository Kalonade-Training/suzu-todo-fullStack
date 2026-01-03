//login
import {useState} from "react"
import { useRouter} from "next/navigation"
import {loginUser} from "../../model/user_api"
import { toast } from 'react-toastify';

export const useLoginViewModel = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    //ログイン処理
    const handleLogin = async (e: React.FormEvent) => { //Reactのフォーム送信イベント型を引数に
    e.preventDefault(); //デフォルトのフォーム送信動作を防止(これをしないとAPIが呼ばれない) 

    try {
      console.log("payload", { email, password });
      const res = await loginUser({ email, password }); //APIクライアント呼び出し
      console.log(res);
      const { token, email: userEmail } = res;
      localStorage.setItem("token", token); // token 保存
      localStorage.setItem("email", userEmail); // email 保存

      toast.success("ログイン成功！");
      
      //入力リセット
        setEmail("");
        setPassword("");
      router.push("/todos"); // TODO一覧ページに遷移
    } catch (err:any) {
      toast.error(err.message);
    }
  };

  return {
    // State
    email,
    password,
    showPassword,
    
    // State更新関数
    setEmail,
    setPassword,
    setShowPassword,
    
    // アクション
    handleLogin,
  };
};

