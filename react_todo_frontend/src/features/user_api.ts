//API通信を行う関数
export interface LoginRequest {
 id: string; 
 email: string; 
 password: string; 
 createdAt: string; 
 updatedAt: string;
}

export interface RegisterRequest {
  id: string; 
  email: string; 
  password: string; 
  createdAt: string; 
  updatedAt: string;
}

export type RegisterResponse = {
  id: string;
  email: string;
  token: string;
};


const API_URL = 'http://localhost:8080';

export const registerUser = async(user: Omit<RegisterRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<RegisterResponse | null> => {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (!res.ok) {
       const errorData = await res.json(); 
        throw new Error(errorData.error || "Failed to register TODO"); 
    }
    return res.json();
}   

export const loginUser = async (user: Omit<LoginRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<{token: string}> => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    }); 
    if (!res.ok) {
        const errorData = await res.json(); 
        throw new Error(errorData.error || "Failed to login TODO");
    }
    return await res.json();
}
