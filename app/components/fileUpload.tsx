"use client";
import { upload } from "@imagekit/next";
import { useState } from "react";
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onSuccess?: (url: string) => void;
  onPrgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onPrgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [fileName, setFileName] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

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
    setUploadStatus("uploading");
    setProgress(0);
    
    try {
      const authRes = await fetch("/api/imagekit-auth");

      if (!authRes.ok) {
        const errorText = await authRes.text();
        throw new Error(`Auth failed: ${errorText}`);
      }

      const authData = await authRes.json();
      const { signature, token, expire } = authData.authparams;
      const publicKey = authData.publicKey as string;
      if (!publicKey) {
        throw new Error("Missing publicKey from server response");
      }
      console.log("Upload params:", { signature, token, expire, publicKey, fileName: file.name });
      console.log("Types:", { signature: typeof signature, token: typeof token, expire: typeof expire, publicKey: typeof publicKey });

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

      setUploadStatus("success");
      if (onSuccess) onSuccess(res.url);
    } catch (error) {
      console.error("Upload failed:", error instanceof Error ? error.message : error);
      setUploadStatus("error");
      alert("Upload failed. See console for details.");
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Upload className="w-5 h-5" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case "success":
        return "Upload Complete";
      case "error":
        return "Upload Failed";
      case "uploading":
        return "Uploading...";
      default:
        return `Upload ${fileType === "video" ? "Video" : "Image"}`;
    }
  };

  return (
    <div className="w-full space-y-4">
      <label
        htmlFor={`file-upload-${fileType || "file"}`}
        className={`cursor-pointer w-full block text-center px-6 py-4 rounded-xl font-medium transition-all duration-200 border-2 border-dashed ${
          uploadStatus === "success"
            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
            : uploadStatus === "error"
            ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
            : uploading
            ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
            : "border-border hover:border-primary hover:bg-accent"
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          {getStatusIcon()}
          <span className={`font-medium ${
            uploadStatus === "success" ? "text-green-700 dark:text-green-300" :
            uploadStatus === "error" ? "text-red-700 dark:text-red-300" :
            uploading ? "text-blue-700 dark:text-blue-300" :
            "text-foreground"
          }`}>
            {getStatusText()}
          </span>
          <span className="text-xs text-muted-foreground">
            {fileType === "video" ? "MP4, MOV, AVI up to 100MB" : "JPG, PNG, GIF up to 100MB"}
          </span>
        </div>
      </label>
      
      <input
        id={`file-upload-${fileType || "file"}`}
        type="file"
        accept={fileType === "video" ? "video/*" : fileType === "image" ? "image/*" : "*/*"}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {fileName && (
        <div className="flex items-center space-x-2 p-3 bg-card rounded-lg border border-border">
          <File className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground truncate">{fileName}</span>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
