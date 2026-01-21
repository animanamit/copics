"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import Link from "next/link";
import { Wand2, Upload, Loader2, X, Lightbulb, Clock, ListOrdered, Palette, Timer } from "lucide-react";
import { toast } from "sonner";
import type { AnalysisResult } from "@/lib/types";
import { useSession } from "@/lib/auth-client";

type AnalysisStep = "preparing" | "analyzing" | "matching" | "tips" | "done";

// Helper to get hex color from code using regions data
function getColorHex(code: string, regions: AnalysisResult["regions"]): string | null {
  for (const region of regions) {
    if (region.primaryColor.code === code) {
      return region.primaryColor.hexPreview;
    }
    for (const secondary of region.secondaryColors) {
      if (secondary.code === code) {
        return secondary.hexPreview;
      }
    }
  }
  return null;
}

// Helper to determine text color based on background luminance
function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1a1a1a' : '#ffffff';
}

interface AnalysisOptions {
  name: string;
  ignoreBackground: boolean;
  simplifiedAnalysis: boolean;
  skillLevel: "beginner" | "intermediate" | "advanced" | "auto";
  customInstructions: string;
}

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

const stepLabels: Record<AnalysisStep, string> = {
  preparing: "preparing image...",
  analyzing: "analyzing colors...",
  matching: "matching copic markers...",
  tips: "generating tips...",
  done: "complete!",
};

const defaultOptions: AnalysisOptions = {
  name: "",
  ignoreBackground: false,
  simplifiedAnalysis: false,
  skillLevel: "auto",
  customInstructions: "",
};

function AnalysisCreator() {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
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

  const processFile = useCallback((file: File) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("please upload a jpeg, png, webp, or gif image");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
    setResult(null);
    setError(null);
    // Set default name from filename (without extension)
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setOptions((prev) => ({ ...prev, name: nameWithoutExt }));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const clearSelection = useCallback(() => {
    setPreview(null);
    setSelectedFile(null);
    setResult(null);
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
    if (!selectedFile) return;
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

    toast.loading("analyzing your artwork...", { id: "analysis" });

    try {
      // Step 1: Get presigned URL and create analysis record
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedFile.name,
          contentType: selectedFile.type,
          name: options.name || selectedFile.name.replace(/\.[^/.]+$/, ""),
        }),
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "failed to prepare upload");
      }

      const { uploadUrl, analysisId } = uploadData;

      // Step 2: Upload image to S3
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

      // Step 3: Run analysis with options
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          options: {
            ignoreBackground: options.ignoreBackground,
            simplifiedAnalysis: options.simplifiedAnalysis,
            skillLevel: options.skillLevel,
            customInstructions: options.customInstructions,
          },
        }),
      });

      const analyzeData = await analyzeResponse.json();

      if (!analyzeResponse.ok) {
        throw new Error(analyzeData.error || "analysis failed");
      }

      // Complete the progress
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setProgress(100);
      setStep("done");
      setResult(analyzeData.result);
      toast.success("analysis complete!", { id: "analysis" });
    } catch (err) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setError(err instanceof Error ? err.message : "something went wrong");
      toast.error("analysis failed", { id: "analysis" });
    } finally {
      setIsAnalyzing(false);
    }
  };

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
          // Upload State
          <div className="space-y-4 animate-fade-up stagger-2">
            {!preview ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-3xl p-12 md:p-16
                  transition-all duration-200 ease-out cursor-pointer
                  ${
                    isDragging
                      ? "border-primary bg-pastel-peach/30 scale-[1.02]"
                      : "border-border/50 hover:border-primary/50 hover:bg-pastel-peach/10"
                  }
                `}
                role="button"
                tabIndex={0}
                aria-label="upload artwork area. drag and drop or click to select file"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    document.getElementById("file-input")?.click();
                  }
                }}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="select image file"
                />
                <div className="flex flex-col items-center justify-center gap-4 text-center pointer-events-none">
                  <div className="p-4 rounded-full bg-pastel-peach/50">
                    <Upload className="w-8 h-8 text-primary" aria-hidden="true" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium">drop your artwork here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse your files
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    jpeg, png, webp, gif
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-scale-in">
                {/* Image + Form Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image Preview */}
                  <div className="relative rounded-3xl overflow-hidden bg-pastel-peach/20 p-2">
                    <img
                      src={preview}
                      alt="preview of selected artwork"
                      className="w-full h-auto max-h-80 object-contain rounded-2xl"
                    />
                    <button
                      onClick={clearSelection}
                      className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                      disabled={isAnalyzing}
                      aria-label="remove selected image"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Options Form */}
                  <div className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="analysis-name">name</Label>
                      <Input
                        id="analysis-name"
                        placeholder="my artwork"
                        value={options.name}
                        onChange={(e) =>
                          setOptions((prev) => ({ ...prev, name: e.target.value }))
                        }
                        disabled={isAnalyzing}
                      />
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3">
                      <Label>options</Label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.ignoreBackground}
                            onChange={(e) =>
                              setOptions((prev) => ({
                                ...prev,
                                ignoreBackground: e.target.checked,
                              }))
                            }
                            disabled={isAnalyzing}
                            className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary/50 focus:ring-offset-0"
                          />
                          <span className="text-sm">ignore background</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.simplifiedAnalysis}
                            onChange={(e) =>
                              setOptions((prev) => ({
                                ...prev,
                                simplifiedAnalysis: e.target.checked,
                              }))
                            }
                            disabled={isAnalyzing}
                            className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary/50 focus:ring-offset-0"
                          />
                          <span className="text-sm">simplified analysis (fewer regions)</span>
                        </label>
                      </div>
                    </div>

                    {/* Skill Level */}
                    <div className="space-y-2">
                      <Label htmlFor="skill-level">skill level</Label>
                      <select
                        id="skill-level"
                        value={options.skillLevel}
                        onChange={(e) =>
                          setOptions((prev) => ({
                            ...prev,
                            skillLevel: e.target.value as AnalysisOptions["skillLevel"],
                          }))
                        }
                        disabled={isAnalyzing}
                        className="w-full h-10 rounded-lg border border-border/50 bg-transparent px-3 text-sm focus:border-ring focus:ring-ring/50 focus:ring-[3px] outline-none"
                      >
                        <option value="auto">auto-detect</option>
                        <option value="beginner">beginner</option>
                        <option value="intermediate">intermediate</option>
                        <option value="advanced">advanced</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        tips will be tailored to your experience
                      </p>
                    </div>

                    {/* Custom Instructions */}
                    <div className="space-y-2">
                      <Label htmlFor="custom-instructions">
                        custom instructions <span className="text-muted-foreground font-normal">(optional)</span>
                      </Label>
                      <textarea
                        id="custom-instructions"
                        placeholder="e.g., focus on the character on the right, ignore the text, use warm colors..."
                        value={options.customInstructions}
                        onChange={(e) =>
                          setOptions((prev) => ({
                            ...prev,
                            customInstructions: e.target.value,
                          }))
                        }
                        disabled={isAnalyzing}
                        rows={3}
                        className="w-full rounded-lg border border-border/50 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:ring-ring/50 focus:ring-[3px] outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Progress UI */}
                {isAnalyzing && step && (
                  <div
                    className="rounded-2xl bg-pastel-peach/30 p-4 space-y-3 animate-fade-in"
                    role="status"
                    aria-live="polite"
                  >
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      {stepLabels[step]}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <p
                    className="text-sm text-muted-foreground truncate max-w-[200px]"
                    title={selectedFile?.name}
                  >
                    {selectedFile?.name}
                  </p>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    size="lg"
                    className="gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2
                          className="w-4 h-4 animate-spin"
                          aria-hidden="true"
                        />
                        analyzing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" aria-hidden="true" />
                        analyze colors
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <p
                className="text-sm text-destructive text-center animate-fade-in"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>
            )}
          </div>
        ) : (
          // Results State
          <div className="space-y-8 animate-fade-up">
            {/* Image + New Analysis Button */}
            <div className="flex items-start gap-4">
              <div className="flex-1 rounded-2xl overflow-hidden bg-pastel-peach/10 p-2">
                <img
                  src={preview!}
                  alt="analyzed artwork"
                  className="w-full h-auto max-h-64 object-contain rounded-xl"
                />
              </div>
              <Button
                variant="outline"
                onClick={clearSelection}
                className="gap-2"
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
                new image
              </Button>
            </div>

            {/* Overall Tips */}
            <Card className="bg-pastel-peach/40 border-0 animate-fade-up stagger-1">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Lightbulb
                        className="w-4 h-4 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="font-medium">overall tips</span>
                  </div>
                  <Badge
                    className={
                      result.difficultyLevel === "beginner"
                        ? "bg-pastel-mint text-green-700"
                        : result.difficultyLevel === "intermediate"
                          ? "bg-pastel-lemon text-yellow-700"
                          : "bg-pastel-coral text-orange-700"
                    }
                  >
                    {result.difficultyLevel}
                  </Badge>
                </div>
                <ul className="space-y-3" aria-label="overall coloring tips">
                  {result.overallTips.map((tip, i) => (
                    <li key={i} className="text-sm flex items-start gap-3">
                      <span className="text-primary mt-0.5" aria-hidden="true">
                        •
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Regions */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium">color regions</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {result.regions.map((region, idx) => (
                  <Card
                    key={idx}
                    className={`animate-fade-up stagger-${Math.min(idx + 2, 8)}`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{region.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {region.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Primary color */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase">
                          primary
                        </p>
                        <ColorCard color={region.primaryColor} region={region.name} />
                      </div>

                      {/* Secondary colors */}
                      {region.secondaryColors.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase">
                            secondary
                          </p>
                          <div className="space-y-2">
                            {region.secondaryColors.map((color, i) => (
                              <ColorCard key={i} color={color} region={region.name} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Blending tips */}
                      {region.blendingTips.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase">
                            blending tips
                          </p>
                          <ul
                            className="space-y-1"
                            aria-label={`blending tips for ${region.name}`}
                          >
                            {region.blendingTips.map((tip, i) => (
                              <li
                                key={i}
                                className="text-sm flex items-start gap-2"
                              >
                                <span className="text-primary" aria-hidden="true">
                                  •
                                </span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Coloring Plan */}
            {result.coloringPlan && (
              <div className="space-y-3 animate-fade-up">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium flex items-center gap-2">
                    <ListOrdered className="w-5 h-5 text-primary" />
                    coloring game plan
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {result.coloringPlan.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5" />
                      {result.coloringPlan.materialsList.length} colors
                    </span>
                  </div>
                </div>

                {/* Materials List - Compact */}
                <div className="bg-pastel-mint/20 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    materials needed
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.coloringPlan.materialsList.map((code, i) => {
                      const hex = getColorHex(code, result.regions);
                      return (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono font-medium"
                          style={{
                            backgroundColor: hex ? `${hex}25` : undefined,
                            color: hex ? getContrastColor(hex) : undefined,
                            border: `1px solid ${hex || '#e5e5e5'}40`,
                          }}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: hex || '#888' }}
                          />
                          {code}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Steps - Compact */}
                <div className="space-y-2">
                  {result.coloringPlan.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl border-l-[3px] bg-card px-3 py-2.5 ${
                        step.waitAfter
                          ? "border-l-amber-400"
                          : "border-l-primary/60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Step number */}
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {step.stepNumber}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Action + Region + Colors in one row */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-medium text-sm">{step.action}</span>
                              <span className="text-muted-foreground text-sm">—</span>
                              <span className="text-muted-foreground text-sm truncate">{step.region}</span>
                            </div>
                            {/* Color badges */}
                            <div className="flex gap-1 flex-shrink-0">
                              {step.colors.map((code, i) => {
                                const hex = getColorHex(code, result.regions);
                                return (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium"
                                    style={{
                                      backgroundColor: hex || '#f5f5f5',
                                      color: hex ? getContrastColor(hex) : '#333',
                                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                                    }}
                                  >
                                    {code}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* Notes */}
                          <p className="text-xs text-muted-foreground mt-1">{step.notes}</p>

                          {/* Wait indicator */}
                          {step.waitAfter && (
                            <div className="flex items-center gap-1 text-[11px] text-amber-600 mt-1.5">
                              <Timer className="w-3 h-3" />
                              {step.waitAfter}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <Link href="/history">
                <Button variant="outline">view history</Button>
              </Link>
              <Button onClick={clearSelection}>analyze another</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ColorCard({
  color,
  region,
}: {
  color: { code: string; name: string; hexPreview: string; family: string };
  region?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 transition-colors hover:bg-muted/70">
      <div
        className="w-10 h-10 rounded-lg ring-1 ring-border/20 flex-shrink-0"
        style={{ backgroundColor: color.hexPreview }}
        role="img"
        aria-label={`color swatch for ${color.name}`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold">{color.code}</span>
          <span className="text-xs text-muted-foreground">{color.family}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{color.name}</p>
      </div>
      <span
        className="text-xs font-mono text-muted-foreground hidden sm:block"
        aria-label={`hex color ${color.hexPreview}`}
      >
        {color.hexPreview}
      </span>
    </div>
  );
}
