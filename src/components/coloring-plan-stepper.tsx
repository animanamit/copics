"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  Clock,
  Palette,
  Timer,
  Eye,
  EyeOff,
} from "lucide-react";
import type { AnalysisResult, ColoringStep } from "@/lib/types";

interface ColoringPlanStepperProps {
  imageUrl: string;
  imageName: string;
  result: AnalysisResult;
}

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

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1a1a1a" : "#ffffff";
}

function getRegionByName(
  regionName: string,
  regions: AnalysisResult["regions"]
): AnalysisResult["regions"][0] | null {
  return regions.find((r) => r.name.toLowerCase() === regionName.toLowerCase()) || null;
}

export function ColoringPlanStepper({
  imageUrl,
  imageName,
  result,
}: ColoringPlanStepperProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showAllSteps, setShowAllSteps] = useState(true);

  const steps = result.coloringPlan?.steps || [];
  const currentStep = steps[currentStepIndex];
  const region = currentStep ? getRegionByName(currentStep.region, result.regions) : null;

  const handlePrevious = () => {
    setCurrentStepIndex(Math.max(0, currentStepIndex - 1));
  };

  const handleNext = () => {
    setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1));
  };

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
    setShowAllSteps(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-primary" />
            coloring game plan
          </h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {result.coloringPlan?.estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" />
              {result.coloringPlan?.materialsList.length} colors
            </span>
          </div>
        </div>
      </div>

      {/* Main step carousel */}
      {!showAllSteps && currentStep && (
        <div className="space-y-4">
          {/* Image with overlay highlight */}
          <div className="relative rounded-2xl overflow-hidden bg-muted border border-border">
            <img
              src={imageUrl}
              alt={imageName}
              className="w-full h-auto max-h-[300px] object-contain"
            />

            {/* Region highlight overlay */}
            {showOverlay && region && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <p className="text-white font-medium text-center">{region.name}</p>
                </div>
              </div>
            )}

            {/* Toggle overlay button */}
            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
              title={showOverlay ? "Hide highlight" : "Show highlight"}
            >
              {showOverlay ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Step details */}
          <Card>
            <CardHeader className="pb-3">
              <div className="space-y-3">
                {/* Progress */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    step {currentStepIndex + 1} of {steps.length}
                  </div>
                  <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Action + Region */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-sm">
                      {currentStep.action}
                    </Badge>
                    <span className="text-sm font-medium text-muted-foreground">
                      →
                    </span>
                    <span className="text-sm font-medium">{currentStep.region}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Colors section */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  colors to use
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentStep.colors.map((code, i) => {
                    const hex = getColorHex(code, result.regions);
                    return (
                      <div
                        key={i}
                        className="group relative flex flex-col items-center gap-0.5 p-1 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                      >
                        <div
                          className="w-6 h-6 rounded-md ring-1 ring-border/20 shadow-sm"
                          style={{ backgroundColor: hex || "#888" }}
                        />
                        <span className="text-[10px] font-mono font-bold text-center leading-tight">
                          {code}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  instructions
                </p>
                <p className="text-sm leading-relaxed">{currentStep.notes}</p>
              </div>

              {/* Wait time */}
              {currentStep.waitAfter && (
                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg px-3 py-2.5 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
                  <Timer className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 uppercase">
                      wait after this step
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      {currentStep.waitAfter}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllSteps(true)}
                >
                  view all steps
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentStepIndex === steps.length - 1}
                  className="gap-2 ml-auto"
                >
                  next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* All steps view */}
      {showAllSteps && (
        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllSteps(false)}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            back to carousel
          </Button>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => handleStepClick(idx)}
                className={`w-full text-left rounded-lg border transition-all ${
                  idx === currentStepIndex
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="rounded-lg border-l-[3px] bg-card px-3 py-2.5 flex items-start gap-3"
                  style={{
                    borderLeftColor: step.waitAfter ? "#fbbf24" : "rgb(var(--primary-rgb) / 0.6)",
                  }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {step.stepNumber}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{step.action}</span>
                      <span className="text-muted-foreground text-sm">—</span>
                      <span className="text-muted-foreground text-sm truncate">
                        {step.region}
                      </span>
                    </div>

                    {/* Color badges */}
                    <div className="flex gap-0.5 mt-1 flex-wrap">
                      {step.colors.map((code, i) => {
                        const hex = getColorHex(code, result.regions);
                        return (
                          <span
                            key={i}
                            className="inline-flex items-center px-1 py-0.5 rounded text-[9px] font-mono font-bold"
                            style={{
                              backgroundColor: hex || "#f5f5f5",
                              color: hex ? getContrastColor(hex) : "#333",
                              boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.1)",
                            }}
                          >
                            {code}
                          </span>
                        );
                      })}
                    </div>

                    <p className="text-xs text-muted-foreground mt-1">{step.notes}</p>

                    {step.waitAfter && (
                      <div className="flex items-center gap-1 text-[11px] text-amber-600 mt-1.5">
                        <Timer className="w-3 h-3" />
                        {step.waitAfter}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
