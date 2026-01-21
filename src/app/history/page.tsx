"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  AnalysisCard,
  AnalysisCardSkeleton,
} from "@/components/analysis-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { AnalysisStatus } from "@/lib/types";

interface AnalysisItem {
  analysisId: string;
  imageName: string;
  imageUrl: string;
  status: AnalysisStatus;
  createdAt: string;
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const fetchAnalyses = useCallback(async (cursor?: string) => {
    try {
      const url = cursor
        ? `/api/analyses?cursor=${encodeURIComponent(cursor)}`
        : "/api/analyses";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("failed to load analyses");
      }

      const data = await response.json();

      if (cursor) {
        setAnalyses((prev) => [...prev, ...data.analyses]);
      } else {
        setAnalyses(data.analyses);
      }

      setNextCursor(data.nextCursor);
    } catch {
      toast.error("failed to load your analyses");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const handleLoadMore = () => {
    if (nextCursor && !isLoadingMore) {
      setIsLoadingMore(true);
      fetchAnalyses(nextCursor);
    }
  };

  const handleDeleteClick = (analysisId: string) => {
    setPendingDeleteId(analysisId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteId) return;

    setDeleteDialogOpen(false);
    setDeletingId(pendingDeleteId);

    try {
      const response = await fetch(`/api/analyses/${pendingDeleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "failed to delete");
      }

      setAnalyses((prev) =>
        prev.filter((a) => a.analysisId !== pendingDeleteId)
      );
      toast.success("analysis deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "failed to delete");
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setNextCursor(null);
    fetchAnalyses();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 animate-fade-up stagger-1">
          <div>
            <h1 className="text-2xl font-semibold">your analyses</h1>
            <p className="text-sm text-muted-foreground">
              view and manage your color analysis history
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              aria-label="refresh analyses"
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
            </Button>
            <Link href="/">
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" aria-hidden="true" />
                new analysis
              </Button>
            </Link>
          </div>
        </header>

        {/* Grid */}
        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            role="status"
            aria-label="loading analyses"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <AnalysisCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-20 space-y-4 animate-fade-up stagger-2">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-pastel-lavender/30">
              <span className="text-4xl" role="img" aria-label="art palette">
                🎨
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">no analyses yet</p>
              <p className="text-sm text-muted-foreground">
                upload your first artwork to get started
              </p>
            </div>
            <Link href="/">
              <Button className="gap-2">
                <Plus className="w-4 h-4" aria-hidden="true" />
                upload artwork
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              role="list"
              aria-label="your analyses"
            >
              {analyses.map((analysis, index) => (
                <div key={analysis.analysisId} role="listitem">
                  <AnalysisCard
                    analysis={analysis}
                    onDelete={handleDeleteClick}
                    isDeleting={deletingId === analysis.analysisId}
                    index={index}
                  />
                </div>
              ))}
            </div>

            {/* Load more */}
            {nextCursor && (
              <div className="text-center mt-8 animate-fade-in">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2
                        className="w-4 h-4 animate-spin"
                        aria-hidden="true"
                      />
                      loading…
                    </>
                  ) : (
                    "load more"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>delete analysis?</DialogTitle>
            <DialogDescription>
              this action cannot be undone. the analysis and its image will be
              permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
            >
              cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
