"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopicColorList } from "@/components/copic-color-card";
import { BlendingTips, OverallTips } from "@/components/blending-tips";
import { ListOrdered, Clock, Palette, Timer } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

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

interface AnalysisResultsProps {
  imageUrl: string;
  imageName: string;
  result: AnalysisResult;
}

export function AnalysisResults({
  imageUrl,
  imageName,
  result,
}: AnalysisResultsProps) {
  return (
    <div className="space-y-8">
      {/* Image display */}
      <div className="rounded-3xl overflow-hidden bg-pastel-lavender/10 p-2">
        <img
          src={imageUrl}
          alt={imageName}
          className="w-full h-auto max-h-[400px] object-contain rounded-2xl"
        />
      </div>

      {/* Overall tips */}
      <OverallTips tips={result.overallTips} difficultyLevel={result.difficultyLevel} />

      {/* Regions */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium">color regions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {result.regions.map((region, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{region.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {region.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <CopicColorList
                  primaryColor={region.primaryColor}
                  secondaryColors={region.secondaryColors}
                />
                <BlendingTips tips={region.blendingTips} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Coloring Plan */}
      {result.coloringPlan && (
        <div className="space-y-3">
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
    </div>
  );
}

interface AnalysisLoadingProps {
  imageUrl?: string;
  imageName?: string;
}

export function AnalysisLoading({ imageUrl, imageName }: AnalysisLoadingProps) {
  return (
    <div className="space-y-8">
      {/* Image display */}
      {imageUrl && (
        <div className="rounded-3xl overflow-hidden bg-pastel-lavender/10 p-2">
          <img
            src={imageUrl}
            alt={imageName || "Analyzing..."}
            className="w-full h-auto max-h-[400px] object-contain rounded-2xl opacity-50"
          />
        </div>
      )}

      {/* Loading state */}
      <div className="text-center py-12 space-y-4">
        <div className="inline-flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-pastel-lavender/30" />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-primary animate-spin" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium">analyzing your artwork...</p>
          <p className="text-sm text-muted-foreground">
            our ai is identifying colors and creating recommendations
          </p>
        </div>
      </div>

      {/* Skeleton cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-3 w-48 bg-muted/50 animate-pulse rounded mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted animate-pulse rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-24 bg-muted/50 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AnalysisError({ message }: { message?: string }) {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="inline-flex items-center justify-center p-4 rounded-full bg-destructive/10">
        <span className="text-3xl">😢</span>
      </div>
      <div className="space-y-2">
        <p className="text-lg font-medium">oops, something went wrong</p>
        <p className="text-sm text-muted-foreground">
          {message || "we couldn't analyze your artwork. please try again."}
        </p>
      </div>
    </div>
  );
}
