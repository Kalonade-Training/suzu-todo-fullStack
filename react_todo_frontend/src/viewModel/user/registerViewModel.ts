//register
import {useState} from "react"
import { registerUser } from "../../model/user_api"
import { useRouter } from "next/navigation"
import { toast } from 'react-toastify';

export const useRegisterViewModel = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
                toast.error("ログイン失敗");
                //入力リセット
                setEmail("");
                setPassword("");
                return;
            }
            //入力リセット
            setEmail("");
            setPassword("");
            
            toast.success(`作成成功！`);
            console.log(`Successfully:${newUser.id}`);
            router.push("/login"); // loginページに遷移

        }catch(err:any){
            toast.error(err.message);
            console.log("failed to create user");
        }
    };
    return {
        email,
        setEmail,
        password,   
        setPassword,
        showPassword,
        setShowPassword,
        handleRegister,
    };
};