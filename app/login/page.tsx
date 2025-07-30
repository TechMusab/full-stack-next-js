"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';


export default function Page() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const router= useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email === "" || password === "") {
            alert("Email and password cannot be empty")
            return;
        }
       const res= await signIn('credentials', {
            email,
            password,
            redirect: false
        })
        if (res?.error) {
            alert("Login failed: " + res.error);
            return;
        }
        console.log("Login successful");
        router.push('/dashboard');

    }

    

    return (
        <>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input type="password"
            placeholder='Password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
             />
             <button type='submit'>Login</button>



        </form>
        <p>
            Not have an account ?
            <button onClick={()=>router.push('/register')} >
                Register
            </button>
            
        </p>
            
        </>
    )
}
