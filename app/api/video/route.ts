import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Video, { IVideo } from "@/models/video";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(){
    try {
        await connectDB()
        const videos=await Video.find({}).sort({createdAt:-1}).lean()
        if(!videos) {
            return Response.json({ message: "No videos found" }, { status: 404 });
        }
        return Response.json(videos);
        
    } catch (error) {
        console.error("Error fetching videos:", error);
        return Response.json({ error: "Failed to fetch videos" }, { status: 500 });
        
    }
}
export async function POST(request: NextRequest) {
    try {
        const session=getServerSession(authOptions);
        if (!session) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();

        const body:IVideo=await request.json();
        const { title, description, videoUrl, thumbnailUrl } = body;
        if (!title || !description || !videoUrl || !thumbnailUrl) {
            return Response.json({ error: "All fields are required" }, { status: 400 });
        }
        const videoData={
            title,
            description,
            videoUrl,
            thumbnailUrl,
            controls:body?.controls || true,
            transformation:{
                height:1920,
                width:1080,
                quality:body.transformation?.quality || 100,
            }

        }
        const newVideo = await Video.create(videoData);
        return Response.json(newVideo, { status: 201 });

        
    } catch (error) {
        console.error("Error creating video:", error);
        return Response.json({ error: "Failed to create video" }, { status: 500 });
        
    }

}