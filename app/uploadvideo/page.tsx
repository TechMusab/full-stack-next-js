"use client";
import React, { useState } from "react";
import FileUpload from "../components/fileUpload";

export default function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!videoUrl || !thumbnailUrl) {
      alert("Please upload both video and thumbnail.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          videoUrl,
          thumbnailUrl,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload video");
      }
      alert("Video uploaded successfully!");
    } catch (error) {
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Upload New Video
        </h1>

        <input
          type="text"
          placeholder="Video Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Video Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
        />

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Upload Video</h3>
          <FileUpload
            fileType="video"
            onSuccess={(url) => setVideoUrl(url)}
            onPrgress={(p) => console.log("Video Progress:", p)}
          />
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Upload Thumbnail</h3>
          <FileUpload
            fileType="image"
            onSuccess={(url) => setThumbnailUrl(url)}
            onPrgress={(p) => console.log("Thumbnail Progress:", p)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}
