"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopicColorList } from "@/components/copic-color-card";
import { BlendingTips, OverallTips } from "@/components/blending-tips";
import { ColorPalette } from "@/components/color-palette";
import { ColoringPlanStepper } from "@/components/coloring-plan-stepper";
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

      {/* Color Palette Section */}
      <ColorPalette result={result} />

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

      {/* Coloring Plan - Interactive Stepper */}
      {result.coloringPlan && (
        <ColoringPlanStepper
          imageUrl={imageUrl}
          imageName={imageName}
          result={result}
        />
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
