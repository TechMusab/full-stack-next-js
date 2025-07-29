"use client";
import { useEffect, useState } from "react";
import { IVideo } from "@/models/video";

const Page = () => {
    const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/video");
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <p>Loading videos...</p>;

  if (videos.length === 0) return <p>No videos uploaded yet.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <div key={video._id} className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">{video.title}</h2>
          <video
            className="w-full mt-2"
            controls
            src={video.videoUrl}
            poster={video.thumbnailUrl}
          />
          <p className="mt-2 text-gray-600">{video.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Page;
