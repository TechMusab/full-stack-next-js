// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
   try {
     const authparams = getUploadAuthParams({
         privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, 
         publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
     })
     return Response.json(
        { 
        authparams,
         publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY 
        }
    )
   } catch (error) {
        console.error("Error getting upload auth params:", error);
        return Response.json({ error: "Failed to get upload auth params" }, { status: 500 });
    
   }
}