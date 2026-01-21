"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AnalysisResults,
  AnalysisLoading,
  AnalysisError,
} from "@/components/analysis-results";
import { SimplifyColorsDialog } from "@/components/simplify-colors-dialog";
import { ArrowLeft, Trash2, Pencil, Check, X, RefreshCw, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import type { AnalysisResult, AnalysisStatus } from "@/lib/types";

interface AnalysisOptions {
  ignoreBackground?: boolean;
  simplifiedAnalysis?: boolean;
  skillLevel?: "beginner" | "intermediate" | "advanced" | "auto";
  customInstructions?: string;
}

interface AnalysisData {
  analysisId: string;
  imageName: string;
  name: string;
  imageUrl: string;
  status: AnalysisStatus;
  result?: AnalysisResult;
  options?: AnalysisOptions;
  createdAt: string;
  updatedAt: string;
}

interface RerunOptions {
  ignoreBackground: boolean;
  simplifiedAnalysis: boolean;
  skillLevel: "beginner" | "intermediate" | "advanced" | "auto";
  customInstructions: string;
  maxColors?: number;
}

const defaultRerunOptions: RerunOptions = {
  ignoreBackground: false,
  simplifiedAnalysis: false,
  skillLevel: "auto",
  customInstructions: "",
  maxColors: undefined,
};

type AnalysisStep = "preparing" | "analyzing" | "matching" | "tips" | "done";

const stepLabels: Record<AnalysisStep, string> = {
  preparing: "preparing image...",
  analyzing: "analyzing colors...",
  matching: "matching copic markers...",
  tips: "generating tips...",
  done: "complete!",
};

export default function AnalyzePage() {
  const params = useParams();
  const router = useRouter();
  const analysisId = params.id as string;

  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Delete confirmation state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Re-run form state
  const [showRerunForm, setShowRerunForm] = useState(false);
  const [rerunOptions, setRerunOptions] = useState<RerunOptions>(defaultRerunOptions);
  const [showRerunConfirmDialog, setShowRerunConfirmDialog] = useState(false);
  const [isRerunning, setIsRerunning] = useState(false);
  const [rerunStep, setRerunStep] = useState<AnalysisStep | null>(null);
  const [rerunProgress, setRerunProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showSimplifyDialog, setShowSimplifyDialog] = useState(false);

  // Update step based on progress
  useEffect(() => {
    if (rerunProgress < 15) setRerunStep("preparing");
    else if (rerunProgress < 50) setRerunStep("analyzing");
    else if (rerunProgress < 80) setRerunStep("matching");
    else if (rerunProgress < 100) setRerunStep("tips");
    else setRerunStep("done");
  }, [rerunProgress]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/analyses/${analysisId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("analysis not found");
          } else {
            const data = await response.json();
            setError(data.error || "failed to load analysis");
          }
          return;
        }

        const data = await response.json();
        setAnalysis(data);

        // If still analyzing, poll for updates
        if (data.status === "analyzing" || data.status === "pending") {
          const pollInterval = setInterval(async () => {
            const pollResponse = await fetch(`/api/analyses/${analysisId}`);
            if (pollResponse.ok) {
              const pollData = await pollResponse.json();
              setAnalysis(pollData);

              if (
                pollData.status === "completed" ||
                pollData.status === "failed"
              ) {
                clearInterval(pollInterval);
              }
            }
          }, 3000);

          return () => clearInterval(pollInterval);
        }
      } catch {
        setError("failed to load analysis");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [analysisId]);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setShowDeleteDialog(false);
    setIsDeleting(true);

    toast.loading("deleting image from storage...", { id: "delete" });

    try {
      const response = await fetch(`/api/analyses/${analysisId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "failed to delete");
      }

      toast.success("analysis deleted successfully", { id: "delete" });
      router.push("/history");
    } catch (err) {
      const message = err instanceof Error ? err.message : "failed to delete";
      toast.error(message, { id: "delete" });
    } finally {
      setIsDeleting(false);
    }
  };

  const startEditing = () => {
    setEditName(analysis?.name || analysis?.imageName || "");
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditName("");
  };

  const saveTitle = async () => {
    if (!editName.trim()) {
      toast.error("name cannot be empty");
      return;
    }

    setIsSavingName(true);

    try {
      const response = await fetch(`/api/analyses/${analysisId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "failed to update name");
      }

      setAnalysis((prev) =>
        prev ? { ...prev, name: editName.trim() } : prev
      );
      setIsEditing(false);
      toast.success("name updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "failed to update name");
    } finally {
      setIsSavingName(false);
    }
  };

  const openRerunForm = () => {
    // Pre-fill with previously used options if available
    if (analysis?.options) {
      setRerunOptions({
        ignoreBackground: analysis.options.ignoreBackground ?? false,
        simplifiedAnalysis: analysis.options.simplifiedAnalysis ?? false,
        skillLevel: analysis.options.skillLevel ?? "auto",
        customInstructions: analysis.options.customInstructions ?? "",
      });
    } else {
      setRerunOptions(defaultRerunOptions);
    }
    setShowRerunForm(true);
  };

  const cancelRerunForm = () => {
    setShowRerunForm(false);
    setRerunOptions(defaultRerunOptions);
  };

  const handleRerunSubmit = () => {
    setShowRerunConfirmDialog(true);
  };

  const handleSimplifyColors = async (maxColors: number) => {
    setIsRerunning(true);
    setRerunProgress(0);
    setRerunStep("preparing");

    // Start progress simulation
    progressIntervalRef.current = setInterval(() => {
      setRerunProgress((p) => {
        if (p < 15) return p + 3;
        if (p < 50) return p + 2;
        if (p < 80) return p + 1;
        if (p < 95) return p + 0.5;
        return p;
      });
    }, 200);

    toast.loading("simplifying palette...", { id: "simplify" });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          options: {
            ...rerunOptions,
            customInstructions: `limit the color palette to a maximum of ${maxColors} colors. prioritize the most impactful and commonly-used colors, and merge or remove less essential colors. maintain visual harmony and readability.`,
          },
          rerun: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "failed to simplify colors");
      }

      // Complete progress
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setRerunProgress(100);
      setRerunStep("done");

      setAnalysis((prev) =>
        prev
          ? {
              ...prev,
              status: "completed" as AnalysisStatus,
              result: data.result,
            }
          : prev
      );

      toast.success(`palette simplified to ${maxColors} colors!`, { id: "simplify" });
    } catch (err) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      toast.error(err instanceof Error ? err.message : "failed to simplify colors", { id: "simplify" });
    } finally {
      setIsRerunning(false);
      setRerunProgress(0);
      setRerunStep(null);
    }
  };

  const confirmRerun = async () => {
    setShowRerunConfirmDialog(false);
    setIsRerunning(true);
    setRerunProgress(0);
    setRerunStep("preparing");

    // Start progress simulation
    progressIntervalRef.current = setInterval(() => {
      setRerunProgress((p) => {
        if (p < 15) return p + 3;
        if (p < 50) return p + 2;
        if (p < 80) return p + 1;
        if (p < 95) return p + 0.5;
        return p;
      });
    }, 200);

    toast.loading("re-analyzing your artwork...", { id: "rerun" });

    try {
      // Build options with maxColors constraint if specified
      const optionsToSend = { ...rerunOptions };
      if (rerunOptions.maxColors) {
        optionsToSend.customInstructions = 
          `${optionsToSend.customInstructions ? optionsToSend.customInstructions + '\n\n' : ''}` +
          `Limit the color palette to a maximum of ${rerunOptions.maxColors} colors. ` +
          `Prioritize the most impactful and commonly-used colors, and merge or remove less essential colors. ` +
          `Maintain visual harmony and readability.`;
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          rerun: true,
          options: optionsToSend,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "failed to re-run analysis");
      }

      // Complete progress
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setRerunProgress(100);
      setRerunStep("done");

      // Update with new result and options
      setAnalysis((prev) =>
        prev
          ? {
              ...prev,
              status: "completed" as AnalysisStatus,
              result: data.result,
              options: {
                ignoreBackground: rerunOptions.ignoreBackground,
                simplifiedAnalysis: rerunOptions.simplifiedAnalysis,
                skillLevel: rerunOptions.skillLevel,
                customInstructions: rerunOptions.customInstructions || undefined,
              },
            }
          : prev
      );

      setShowRerunForm(false);
      setRerunOptions(defaultRerunOptions);
      toast.success("analysis complete!", { id: "rerun" });
    } catch (err) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      toast.error(err instanceof Error ? err.message : "failed to re-run analysis", { id: "rerun" });
    } finally {
      setIsRerunning(false);
      setRerunProgress(0);
      setRerunStep(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back button and actions */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/history">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              back to history
            </Button>
          </Link>

          {analysis && !showRerunForm && (
            <div className="flex gap-2">
              {analysis.result && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowSimplifyDialog(true)}
                >
                  <Wand2 className="w-4 h-4" />
                  simplify colors
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
                delete
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <AnalysisLoading />
        ) : error ? (
          <AnalysisError message={error} />
        ) : analysis?.status === "failed" ? (
          <AnalysisError message="the analysis failed. please try uploading again." />
        ) : analysis?.status === "pending" || analysis?.status === "analyzing" ? (
          <AnalysisLoading
            imageUrl={analysis.imageUrl}
            imageName={analysis.imageName}
          />
        ) : showRerunForm && analysis ? (
          // Re-run Form View - 2 Column Layout
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold mb-2">re-run analysis</h1>
              <p className="text-sm text-muted-foreground">
                adjust options and re-analyze your artwork
              </p>
            </div>

            <div className="space-y-6">
              {/* Progress UI during re-run */}
              {isRerunning && rerunStep && (
                <div
                  className="rounded-2xl bg-pastel-peach/30 p-4 space-y-3 animate-fade-in"
                  role="status"
                  aria-live="polite"
                >
                  <Progress value={rerunProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    {stepLabels[rerunStep]}
                  </p>
                </div>
              )}

              {/* 2-Column Grid: Image + Form */}
              {!isRerunning && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image Preview */}
                  <div className="relative rounded-3xl overflow-hidden bg-pastel-peach/20 p-2">
                    <img
                      src={analysis.imageUrl}
                      alt={analysis.name || analysis.imageName}
                      className="w-full h-auto max-h-80 object-contain rounded-2xl"
                    />
                    <p className="text-sm text-muted-foreground mt-3 text-center truncate px-2">
                      {analysis.name || analysis.imageName}
                    </p>
                  </div>

                  {/* Options Form */}
                  <div className="space-y-4">
                    {/* Checkboxes */}
                    <div className="space-y-3">
                      <Label>options</Label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rerunOptions.ignoreBackground}
                            onChange={(e) =>
                              setRerunOptions((prev) => ({
                                ...prev,
                                ignoreBackground: e.target.checked,
                              }))
                            }
                            className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary/50 focus:ring-offset-0"
                          />
                          <span className="text-sm">ignore background</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rerunOptions.simplifiedAnalysis}
                            onChange={(e) =>
                              setRerunOptions((prev) => ({
                                ...prev,
                                simplifiedAnalysis: e.target.checked,
                              }))
                            }
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
                        value={rerunOptions.skillLevel}
                        onChange={(e) =>
                          setRerunOptions((prev) => ({
                            ...prev,
                            skillLevel: e.target.value as RerunOptions["skillLevel"],
                          }))
                        }
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

                    {/* Max Colors Constraint */}
                    <div className="space-y-2">
                      <Label htmlFor="max-colors">
                        max colors <span className="text-muted-foreground font-normal">(optional)</span>
                      </Label>
                      <select
                        id="max-colors"
                        value={rerunOptions.maxColors ?? ""}
                        onChange={(e) =>
                          setRerunOptions((prev) => ({
                            ...prev,
                            maxColors: e.target.value ? parseInt(e.target.value) : undefined,
                          }))
                        }
                        className="w-full h-10 rounded-lg border border-border/50 bg-transparent px-3 text-sm focus:border-ring focus:ring-ring/50 focus:ring-[3px] outline-none"
                      >
                        <option value="">no limit</option>
                        <option value="4">4 colors (minimal)</option>
                        <option value="5">5 colors</option>
                        <option value="6">6 colors (balanced)</option>
                        <option value="7">7 colors</option>
                        <option value="8">8 colors (detailed)</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        limit palette to specified colors only
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
                        value={rerunOptions.customInstructions}
                        onChange={(e) =>
                          setRerunOptions((prev) => ({
                            ...prev,
                            customInstructions: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full rounded-lg border border-border/50 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:ring-ring/50 focus:ring-[3px] outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {!isRerunning && (
                <div className="flex items-center justify-end gap-3">
                  <Button variant="outline" onClick={cancelRerunForm}>
                    cancel
                  </Button>
                  <Button onClick={handleRerunSubmit} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    re-run analysis
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : analysis?.result ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              {/* Editable Title */}
              <div className="flex items-center gap-3 mb-2">
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      ref={inputRef}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveTitle();
                        if (e.key === "Escape") cancelEditing();
                      }}
                      className="text-2xl font-semibold h-auto py-1"
                      disabled={isSavingName}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={saveTitle}
                      disabled={isSavingName}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={cancelEditing}
                      disabled={isSavingName}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-semibold">
                      {analysis.name || analysis.imageName}
                    </h1>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={startEditing}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  here are your copic picks!
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openRerunForm}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  re-run analysis
                </Button>
              </div>

              {/* Display options used for this analysis */}
              {analysis.options && (
                analysis.options.ignoreBackground ||
                analysis.options.simplifiedAnalysis ||
                (analysis.options.skillLevel && analysis.options.skillLevel !== "auto") ||
                analysis.options.customInstructions
              ) && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {analysis.options.ignoreBackground && (
                    <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      background ignored
                    </span>
                  )}
                  {analysis.options.simplifiedAnalysis && (
                    <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      simplified
                    </span>
                  )}
                  {analysis.options.skillLevel && analysis.options.skillLevel !== "auto" && (
                    <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {analysis.options.skillLevel} level
                    </span>
                  )}
                  {analysis.options.customInstructions && (
                    <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground max-w-xs truncate">
                      &quot;{analysis.options.customInstructions}&quot;
                    </span>
                  )}
                </div>
              )}
            </div>
            <AnalysisResults
              imageUrl={analysis.imageUrl}
              imageName={analysis.name || analysis.imageName}
              result={analysis.result}
            />
          </div>
        ) : (
          <AnalysisError message="no results available" />
        )}
      </main>

      {/* Re-run Confirmation Dialog */}
      <Dialog open={showRerunConfirmDialog} onOpenChange={setShowRerunConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>re-run analysis?</DialogTitle>
            <DialogDescription>
              this will replace your current analysis results with a new AI-generated analysis using the options you selected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRerunConfirmDialog(false)}>
              cancel
            </Button>
            <Button onClick={confirmRerun} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>delete analysis?</DialogTitle>
            <DialogDescription>
              this will permanently delete the image from storage and remove all analysis data. this action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Simplify Colors Dialog */}
      {analysis?.result && (
        <SimplifyColorsDialog
          isOpen={showSimplifyDialog}
          onOpenChange={setShowSimplifyDialog}
          currentColorCount={analysis.result.coloringPlan?.materialsList.length || 0}
          onSimplify={handleSimplifyColors}
          isLoading={isRerunning}
        />
      )}
    </div>
  );
}
