"use client";
import { upload } from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps {
  onSuccess?: (url: string) => void;
  onPrgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onPrgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [fileName, setFileName] = useState<string>("");

  const validateFile = (file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      throw new Error("File size exceeds 100MB limit.");
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) return;

    setUploading(true);
    setFileName(file.name);
    try {
      const authRes = await fetch("/api/imagekit-auth");

      if (!authRes.ok) {
        const errorText = await authRes.text();
        throw new Error(`Auth failed: ${errorText}`);
      }

      const authData = await authRes.json();
      const { signature, token, expire } = authData.authparams;
      const publicKey = authData.publicKey;;

      const res = await upload({
        file,
        fileName: file.name,
        publicKey,
        signature,
        expire,
        token,
        onProgress: (event) => {
          if (event.lengthComputable && onPrgress) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
            onPrgress(percent);
          }
        },
      });

      if (onSuccess) onSuccess(res.url);
    } catch (error) {
      console.error("Upload failed:", error instanceof Error ? error.message : error);
      alert("Upload failed. See console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-2">
      <label
        htmlFor={`file-upload-${fileType}`}
        className="cursor-pointer w-full block text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
      >
        {uploading ? "Uploading..." : `Upload ${fileType === "video" ? "Video" : "Image"}`}
      </label>
      <input
        id={`file-upload-${fileType}`}
        type="file"
        accept={fileType === "video" ? "video/*" : fileType === "image" ? "image/*" : "*/*"}
        onChange={handleFileChange}
        className="hidden"
      />

      {fileName && (
        <p className="text-sm text-gray-700 font-medium">{fileName}</p>
      )}

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
