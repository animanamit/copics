"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import type { AnalysisStatus } from "@/lib/types";

interface AnalysisCardData {
  analysisId: string;
  imageName: string;
  imageUrl: string;
  status: AnalysisStatus;
  createdAt: string;
}

interface AnalysisCardProps {
  analysis: AnalysisCardData;
  onDelete?: (analysisId: string) => void;
  isDeleting?: boolean;
  index?: number;
}

export function AnalysisCard({
  analysis,
  onDelete,
  isDeleting,
  index = 0,
}: AnalysisCardProps) {
  const statusConfig = {
    pending: {
      label: "pending",
      variant: "secondary" as const,
      icon: null,
    },
    analyzing: {
      label: "analyzing",
      variant: "secondary" as const,
      icon: <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />,
    },
    completed: {
      label: "completed",
      variant: "default" as const,
      icon: null,
    },
    failed: {
      label: "failed",
      variant: "destructive" as const,
      icon: <AlertCircle className="w-3 h-3" aria-hidden="true" />,
    },
  };

  const status = statusConfig[analysis.status];

  // Calculate stagger delay class based on index (max 8)
  const staggerClass = index < 8 ? `stagger-${index + 1}` : "";

  return (
    <Card className={`overflow-hidden group animate-fade-up ${staggerClass}`}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={analysis.imageUrl}
          alt={`Analysis of ${analysis.imageName}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
        {/* Overlay on hover - uses opacity for compositor-friendly animation */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out"
          aria-hidden="true"
        />

        {/* Actions on hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out">
          {analysis.status === "completed" && (
            <Link href={`/analyze/${analysis.analysisId}`}>
              <Button
                size="sm"
                variant="secondary"
                className="gap-1.5"
                aria-label={`view analysis of ${analysis.imageName}`}
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                view
              </Button>
            </Link>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              className="gap-1.5"
              onClick={() => onDelete(analysis.analysisId)}
              disabled={isDeleting}
              aria-label={`delete analysis of ${analysis.imageName}`}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              )}
              delete
            </Button>
          )}
        </div>

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <Badge
            variant={status.variant}
            className="gap-1 text-xs"
            aria-label={`status: ${status.label}`}
          >
            {status.icon}
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-1">
        <p className="text-sm font-medium truncate" title={analysis.imageName}>
          {analysis.imageName}
        </p>
        <p className="text-xs text-muted-foreground">
          <time dateTime={analysis.createdAt}>
            {formatDistanceToNow(new Date(analysis.createdAt), {
              addSuffix: true,
            })}
          </time>
        </p>
      </div>
    </Card>
  );
}

export function AnalysisCardSkeleton({ index = 0 }: { index?: number }) {
  const staggerClass = index < 8 ? `stagger-${index + 1}` : "";

  return (
    <Card className={`overflow-hidden animate-fade-in ${staggerClass}`}>
      <div className="aspect-square bg-muted animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-3 w-1/2 bg-muted/50 animate-pulse rounded" />
      </div>
    </Card>
  );
}
