"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Lightbulb,
  Clock,
  ListOrdered,
  Palette,
  Timer,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { getColorHex, getContrastColor } from "@/lib/analysis-helpers";
import { ShoppingListDisplay } from "./shopping-list-display";

interface ResultsDisplayProps {
  results: AnalysisResult[];
  previews: { file: File; preview: string }[];
  options: any;
  onClearSelection: () => void;
}

function ColorCard({
  color,
  region,
}: {
  color: {
    code: string;
    name: string;
    hexPreview: string;
    family: string;
  };
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

export function ResultsDisplay({
  results,
  previews,
  options,
  onClearSelection,
}: ResultsDisplayProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Image Previews */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previews.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl overflow-hidden bg-pastel-peach/10 p-2"
          >
            <img
              src={item.preview}
              alt={`analyzed ${item.file.name}`}
              className="w-full h-40 object-cover rounded-xl"
            />
          </div>
        ))}
      </div>

      {/* Shopping List (if available) */}
      {results[0]?.shoppingList && <ShoppingListDisplay shoppingList={results[0].shoppingList} />}

      {/* Overall Tips (show only if not shopping list mode) */}
      {!options.shoppingList && results.length > 0 && results[0]?.overallTips && (
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
                  results[0].difficultyLevel === "beginner"
                    ? "bg-pastel-mint text-green-700"
                    : results[0].difficultyLevel === "intermediate"
                      ? "bg-pastel-lemon text-yellow-700"
                      : "bg-pastel-coral text-orange-700"
                }
              >
                {results[0].difficultyLevel}
              </Badge>
            </div>
            <ul className="space-y-3" aria-label="overall coloring tips">
              {results[0].overallTips.map((tip, i) => (
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
      )}

      {/* Regions */}
      {results[0]?.regions && (
      <div className="space-y-4">
        <h2 className="text-lg font-medium">color regions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {results[0].regions.map((region, idx) => (
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
      )}

      {/* Coloring Plan */}
      {results[0].coloringPlan && !options.colorsOnly && (
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
                {results[0].coloringPlan.estimatedTime}
              </span>
              <span className="flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" />
                {results[0].coloringPlan.materialsList.length} colors
              </span>
            </div>
          </div>

          {/* Materials List - Compact */}
          <div className="bg-pastel-mint/20 rounded-xl px-3 py-2.5">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
              materials needed
            </p>
            <div className="flex flex-wrap gap-1.5">
              {results[0].coloringPlan.materialsList.map((code, i) => {
                const hex = getColorHex(code, results[0].regions);
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono font-medium"
                    style={{
                      backgroundColor: hex ? `${hex}25` : undefined,
                      color: hex ? getContrastColor(hex) : undefined,
                      border: `1px solid ${hex || "#e5e5e5"}40`,
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: hex || "#888" }}
                    />
                    {code}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Steps - Compact */}
          <div className="space-y-2">
            {results[0].coloringPlan.steps.map((step, idx) => (
              <div
                key={idx}
                className={`rounded-xl border-l-[3px] bg-card px-3 py-2.5 ${
                  step.waitAfter ? "border-l-amber-400" : "border-l-primary/60"
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
                        <span className="font-medium text-sm">
                          {step.action}
                        </span>
                        <span className="text-muted-foreground text-sm">—</span>
                        <span className="text-muted-foreground text-sm truncate">
                          {step.region}
                        </span>
                      </div>
                      {/* Color badges */}
                      <div className="flex gap-1 flex-shrink-0">
                        {step.colors.map((code, i) => {
                          const hex = getColorHex(code, results[0].regions);
                          return (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium"
                              style={{
                                backgroundColor: hex || "#f5f5f5",
                                color: hex
                                  ? getContrastColor(hex)
                                  : "#333",
                                boxShadow:
                                  "inset 0 0 0 1px rgba(0,0,0,0.1)",
                              }}
                            >
                              {code}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notes */}
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.notes}
                    </p>

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
        <Button onClick={onClearSelection}>analyze another</Button>
      </div>
    </div>
  );
}
