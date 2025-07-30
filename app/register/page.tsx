"use client";
import { useRouter } from 'next/navigation';
import React from 'react'

export default function Page() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const router=useRouter();
    const handleSubmit=async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (email === "" || password === "") {
            alert("Email and password cannot be empty");
            return;
        }
        try {
            const res=await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
            await res.json();
            if(!res.ok) {
                throw new Error("Registration failed");
            }
            console.log("Registration successful");
            router.push('/login');
            
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
            
        }

    }
    

    return (
       <div>
        <h1>
            Register
        </h1>
        <form onSubmit={handleSubmit} >
            <input
             type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
             />
             <input
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              />
             <input
              type="password"
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              />
              <button type='submit'>Register</button>
        </form>
        <p>
            Already have an account? <a href="/login">Login</a>
        </p>
       </div>
    )
}
