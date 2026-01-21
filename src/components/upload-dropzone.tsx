"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Image as ImageIcon, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UploadDropzoneProps {
  onUploadComplete?: (analysisId: string) => void;
}

export function UploadDropzone({ onUploadComplete }: UploadDropzoneProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("please upload a jpeg, png, webp, or gif image");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const clearSelection = useCallback(() => {
    setPreview(null);
    setSelectedFile(null);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      // Step 1: Get presigned URL
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedFile.name,
          contentType: selectedFile.type,
        }),
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || "failed to get upload url");
      }

      const { uploadUrl, analysisId } = await uploadResponse.json();

      // Step 2: Upload to S3
      const s3Response = await fetch(uploadUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      if (!s3Response.ok) {
        throw new Error("failed to upload image");
      }

      // Step 3: Trigger analysis
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId }),
      });

      if (!analyzeResponse.ok) {
        const error = await analyzeResponse.json();
        throw new Error(error.error || "failed to start analysis");
      }

      toast.success("analysis complete!");

      if (onUploadComplete) {
        onUploadComplete(analysisId);
      } else {
        router.push(`/analyze/${analysisId}`);
      }
    } catch (error) {
      console.error("upload error:", error);
      toast.error(error instanceof Error ? error.message : "upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-3xl p-12
            transition-all duration-200 ease-out
            ${
              isDragging
                ? "border-primary bg-pastel-lavender/30 scale-[1.02]"
                : "border-border/50 hover:border-primary/50 hover:bg-pastel-lavender/10"
            }
          `}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center gap-4 text-center pointer-events-none">
            <div className="p-4 rounded-full bg-pastel-lavender/50">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">drop your artwork here</p>
              <p className="text-sm text-muted-foreground">
                or click to browse your files
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ImageIcon className="w-4 h-4" />
              <span>jpeg, png, webp, gif</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-pastel-lavender/20 p-2">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain rounded-2xl"
            />
            <button
              onClick={clearSelection}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
              {selectedFile?.name}
            </p>
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              size="lg"
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  analyzing...
                </>
              ) : (
                <>analyze colors</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
