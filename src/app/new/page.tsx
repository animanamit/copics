"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { toast } from "sonner";
import type { AnalysisResult } from "@/lib/types";
import { useSession } from "@/lib/auth-client";
import {
  UploadForm,
  AnalysisOptions,
  defaultOptions,
} from "@/components/analysis/upload-form";
import { ResultsDisplay } from "@/components/analysis/results-display";

type AnalysisStep = "preparing" | "analyzing" | "matching" | "tips" | "done";

export default function NewAnalysisPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirect to sign-in if not authenticated
  if (!isPending && !session?.user) {
    router.replace("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AnalysisCreator />
      </main>
    </div>
  );
}

function AnalysisCreator() {
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>(
    []
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [step, setStep] = useState<AnalysisStep | null>(null);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [options, setOptions] = useState<AnalysisOptions>(defaultOptions);

  // Update step based on progress
  useEffect(() => {
    if (progress < 15) setStep("preparing");
    else if (progress < 50) setStep("analyzing");
    else if (progress < 80) setStep("matching");
    else if (progress < 100) setStep("tips");
    else setStep("done");
  }, [progress]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

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

  const processFiles = useCallback((files: FileList) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    const maxFiles = 3;
    if (files.length > maxFiles) {
      setError(`please upload a maximum of ${maxFiles} images`);
      return;
    }

    const newPreviews: { file: File; preview: string }[] = [];
    let processedCount = 0;

    Array.from(files).forEach((file, index) => {
      if (!allowedTypes.includes(file.type)) {
        setError("please upload jpeg, png, webp, or gif images only");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews[index] = {
          file,
          preview: e.target?.result as string,
        };
        processedCount++;

        if (processedCount === files.length) {
          setPreviews(newPreviews.filter(Boolean));
          setResults([]);
          setError(null);
          // Set default name from first filename
          const nameWithoutExt = files[0].name.replace(/\.[^/.]+$/, "");
          setOptions((prev) => ({ ...prev, name: nameWithoutExt }));
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files) processFiles(files);
    },
    [processFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;
      if (files) processFiles(files);
    },
    [processFiles]
  );

  const handlePaste = useCallback(
    (files: FileList) => {
      processFiles(files);
    },
    [processFiles]
  );

  const handleRemoveFile = useCallback((idx: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleAddFiles = useCallback(() => {
    document.getElementById("file-input")?.click();
  }, []);

  const clearSelection = useCallback(() => {
    setPreviews([]);
    setResults([]);
    setError(null);
    setStep(null);
    setProgress(0);
    setOptions(defaultOptions);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const handleAnalyze = async () => {
    if (previews.length === 0) return;
    setIsAnalyzing(true);
    setError(null);
    setProgress(0);
    setStep("preparing");

    // Start progress simulation
    progressIntervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p < 15) return p + 3; // preparing: fast
        if (p < 50) return p + 2; // analyzing: medium
        if (p < 80) return p + 1; // matching: slower
        if (p < 95) return p + 0.5; // tips: slowest
        return p; // hold at 95% until API returns
      });
    }, 200);

    const imageCount = previews.length;
    toast.loading(
      `analyzing ${imageCount} artwork${imageCount > 1 ? "s" : ""}...`,
      { id: "analysis" }
    );

    try {
      const allResults: AnalysisResult[] = [];

      // Step 1: Create batch analysis record and get presigned URLs
      const batchResponse = await fetch("/api/batch-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: previews.map((p) => ({
            filename: p.file.name,
            contentType: p.file.type,
          })),
          analysisName:
            options.name || previews[0].file.name.replace(/\.[^/.]+$/, ""),
        }),
      });

      const batchData = await batchResponse.json();

      if (!batchResponse.ok) {
        throw new Error(batchData.message || "batch upload failed");
      }

      const batchId = batchData.batchId;
      console.log("Created batch with ID:", batchId);

      // Step 2: Upload each image to S3 and analyze
      for (let i = 0; i < previews.length; i++) {
        const { file: selectedFile } = previews[i];
        const uploadInfo = batchData.uploads[i];

        // Step 3: Upload to S3
        const uploadToS3 = await fetch(uploadInfo.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });

        if (!uploadToS3.ok) {
          throw new Error("s3 upload failed");
        }

        // Step 4: Analyze the image (still uses batch ID)
        const analyzeResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analysisId: batchId,
            imageUrl: uploadInfo.imageUrl,
            options,
          }),
        });

        if (!analyzeResponse.ok) {
          const errorData = await analyzeResponse.json();
          const errorMsg = errorData.error || errorData.message || "analysis failed";
          console.error("Analyze API error:", { status: analyzeResponse.status, errorData });
          throw new Error(errorMsg);
        }

        const responseData = await analyzeResponse.json();
        const result: AnalysisResult = responseData.result;
        console.log("Analyze API success:", { result });
        allResults.push(result);
      }

      setProgress(100);
      setResults(allResults);
      toast.success("analysis complete!", { id: "analysis" });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "an error occurred during analysis";
      setError(message);
      toast.error(message, { id: "analysis" });
    } finally {
      setIsAnalyzing(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  const result = results.length > 0;
  const preview = previews.length > 0;

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2 mb-8 animate-fade-up stagger-1">
          <h1 className="text-2xl font-semibold">new analysis</h1>
          <p className="text-muted-foreground">
            upload an image to get copic marker recommendations
          </p>
        </div>

        {!result ? (
          <UploadForm
            previews={previews}
            isAnalyzing={isAnalyzing}
            isDragging={isDragging}
            options={options}
            progress={progress}
            error={error}
            step={step}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileSelect={handleFileSelect}
            onPaste={handlePaste}
            onRemoveFile={handleRemoveFile}
            onAddFiles={handleAddFiles}
            onOptionsChange={setOptions}
            onAnalyze={handleAnalyze}
          />
        ) : (
          <ResultsDisplay
            results={results}
            previews={previews}
            options={options}
            onClearSelection={clearSelection}
          />
        )}
      </div>
    </section>
  );
}
