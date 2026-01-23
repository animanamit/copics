"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, Loader2, X, Wand2 } from "lucide-react";

export interface AnalysisOptions {
  name: string;
  ignoreBackground: boolean;
  simplifiedAnalysis: boolean;
  skillLevel: "beginner" | "intermediate" | "advanced" | "auto";
  customInstructions: string;
  colorsOnly: boolean;
  shoppingList: boolean;
}

export const defaultOptions: AnalysisOptions = {
  name: "",
  ignoreBackground: false,
  simplifiedAnalysis: false,
  skillLevel: "auto",
  customInstructions: "",
  colorsOnly: false,
  shoppingList: false,
};

interface UploadFormProps {
  previews: { file: File; preview: string }[];
  isAnalyzing: boolean;
  isDragging: boolean;
  options: AnalysisOptions;
  progress: number;
  error: string | null;
  step: string | null;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPaste: (files: FileList) => void;
  onRemoveFile: (idx: number) => void;
  onAddFiles: () => void;
  onOptionsChange: (options: AnalysisOptions) => void;
  onAnalyze: () => void;
}

const stepLabels: Record<string, string> = {
  preparing: "preparing image...",
  analyzing: "analyzing colors...",
  matching: "matching copic markers...",
  tips: "generating tips...",
  done: "complete!",
};

export function UploadForm({
  previews,
  isAnalyzing,
  isDragging,
  options,
  progress,
  error,
  step,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onPaste,
  onRemoveFile,
  onAddFiles,
  onOptionsChange,
  onAnalyze,
}: UploadFormProps) {
  const hasPreview = previews.length > 0;

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file" && items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) imageFiles.push(file);
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault();
      const dataTransfer = new DataTransfer();
      imageFiles.forEach((file) => dataTransfer.items.add(file));
      onPaste(dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4 animate-fade-up stagger-2">
      <input
        id="file-input"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onFileSelect}
        multiple
        className="hidden"
        aria-label="select image files"
      />
      {!hasPreview ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onPaste={handlePaste}
          onClick={() => document.getElementById("file-input")?.click()}
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
          {/* Image Previews */}
          <div className="grid grid-cols-3 gap-4">
            {previews.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl overflow-hidden bg-pastel-peach/10 p-2 relative group"
              >
                <img
                  src={item.preview}
                  alt={`preview ${item.file.name}`}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <button
                  onClick={() => onRemoveFile(idx)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`remove ${item.file.name}`}
                >
                  <X className="w-3 h-3 text-white" aria-hidden="true" />
                </button>
                <p className="text-[10px] text-muted-foreground truncate mt-1 px-1">
                  {item.file.name}
                </p>
              </div>
            ))}
            {previews.length < 3 && (
              <button
                onClick={onAddFiles}
                className="col-span-1 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 p-4 flex items-center justify-center transition-colors"
                disabled={isAnalyzing}
                aria-label="add more images"
              >
                <Upload className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
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
                  onOptionsChange({ ...options, name: e.target.value })
                }
                disabled={isAnalyzing}
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <Label>options</Label>
              <div className="space-y-2">
                {[
                  {
                    id: "ignore-background",
                    label: "ignore background",
                    key: "ignoreBackground" as const,
                  },
                  {
                    id: "simplified-analysis",
                    label: "simplified analysis (fewer regions)",
                    key: "simplifiedAnalysis" as const,
                  },
                  {
                    id: "colors-only",
                    label: "colors only (skip coloring timeline)",
                    key: "colorsOnly" as const,
                  },
                  {
                    id: "shopping-list",
                    label: "shopping list (organized by section)",
                    key: "shoppingList" as const,
                  },
                ].map((option) => (
                  <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options[option.key]}
                      onChange={(e) =>
                        onOptionsChange({
                          ...options,
                          [option.key]: e.target.checked,
                        })
                      }
                      disabled={isAnalyzing}
                      className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary/50 focus:ring-offset-0"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skill Level */}
            <div className="space-y-2">
              <Label htmlFor="skill-level">skill level</Label>
              <select
                id="skill-level"
                value={options.skillLevel}
                onChange={(e) =>
                  onOptionsChange({
                    ...options,
                    skillLevel: e.target.value as AnalysisOptions["skillLevel"],
                  })
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
                custom instructions{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <textarea
                id="custom-instructions"
                placeholder="e.g., focus on the character on the right, ignore the text, use warm colors..."
                value={options.customInstructions}
                onChange={(e) =>
                  onOptionsChange({
                    ...options,
                    customInstructions: e.target.value,
                  })
                }
                disabled={isAnalyzing}
                rows={3}
                className="w-full rounded-lg border border-border/50 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:ring-ring/50 focus:ring-[3px] outline-none resize-none"
              />
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
                  {stepLabels[step] || step}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {previews.length} image{previews.length !== 1 ? "s" : ""}{" "}
                selected
              </p>
              <Button
                onClick={onAnalyze}
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
  );
}
