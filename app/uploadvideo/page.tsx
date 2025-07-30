"use client";
import React, { useState } from "react";
import FileUpload from "../components/fileUpload";
import { Upload, Video, Image, FileText, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Upload className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Share Your Video
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your video and share it with the world. Add a compelling title, 
            description, and thumbnail to make your content stand out.
          </p>
        </div>

        {/* Upload Form */}
        <div className="glass rounded-2xl p-8 shadow-xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-foreground flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Video Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter an engaging title for your video"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                required
                className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Video Description
              </label>
              <textarea
                id="description"
                placeholder="Describe your video content, what viewers can expect, and any relevant details"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
                rows={4}
                className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            {/* Video Upload */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground flex items-center">
                <Video className="w-4 h-4 mr-2" />
                Upload Video
              </label>
              <div className="p-6 bg-background/30 border border-border rounded-lg">
                <FileUpload
                  fileType="video"
                  onSuccess={(url) => setVideoUrl(url)}
                  onPrgress={(p) => console.log("Video Progress:", p)}
                />
                {videoUrl && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      ✓ Video uploaded successfully
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground flex items-center">
                <Image className="w-4 h-4 mr-2" />
                Upload Thumbnail
              </label>
              <div className="p-6 bg-background/30 border border-border rounded-lg">
                <FileUpload
                  fileType="image"
                  onSuccess={(url) => setThumbnailUrl(url)}
                  onPrgress={(p) => console.log("Thumbnail Progress:", p)}
                />
                {thumbnailUrl && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      ✓ Thumbnail uploaded successfully
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !videoUrl || !thumbnailUrl}
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white font-semibold py-4 rounded-lg hover:from-primary/90 hover:to-purple-600/90 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <ArrowRight className="w-5 h-5 mr-2" />
              )}
              {loading ? "Uploading Video..." : "Publish Video"}
            </button>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-4">Upload Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="p-4 bg-card/50 rounded-lg border border-border">
              <p>• Use descriptive titles that capture attention</p>
            </div>
            <div className="p-4 bg-card/50 rounded-lg border border-border">
              <p>• Add detailed descriptions to help viewers find your content</p>
            </div>
            <div className="p-4 bg-card/50 rounded-lg border border-border">
              <p>• Choose an eye-catching thumbnail to increase views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
