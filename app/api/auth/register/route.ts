import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextRequest,NextResponse } from "next/server";

export async function POST (req:NextRequest){
    try {
        const {email,password}=await req.json();

        if(!email || !password){
            return NextResponse.json({message:"Email and password are required"}, {status:400});
        }

        await connectDB();
        const existingUser=await User.findOne({email})
        if(existingUser){
            return NextResponse.json({message:"User already exists"}, {status:400});
        }
        await User.create({email,password});
        return NextResponse.json({message:"User created successfully"}, {status:201});

        
    } catch (error) {
        console.error("Error in registration:", error);
        return NextResponse.json({message:"Internal server error"}, {status:500});
        
    }
}