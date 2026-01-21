"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { AnalysisResult } from "@/lib/types";

interface ColorPaletteProps {
  result: AnalysisResult;
}

interface ColorInfo {
  code: string;
  name: string;
  hex: string;
  family: string;
  regions: string[];
}

export function ColorPalette({ result }: ColorPaletteProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Extract all unique colors with their regions
  const colorMap = new Map<string, ColorInfo>();

  result.regions.forEach((region) => {
    // Primary color
    const primaryCode = region.primaryColor.code;
    if (!colorMap.has(primaryCode)) {
      colorMap.set(primaryCode, {
        code: primaryCode,
        name: region.primaryColor.name,
        hex: region.primaryColor.hexPreview,
        family: region.primaryColor.family,
        regions: [region.name],
      });
    } else {
      const info = colorMap.get(primaryCode)!;
      if (!info.regions.includes(region.name)) {
        info.regions.push(region.name);
      }
    }

    // Secondary colors
    region.secondaryColors.forEach((secondary) => {
      if (!colorMap.has(secondary.code)) {
        colorMap.set(secondary.code, {
          code: secondary.code,
          name: secondary.name,
          hex: secondary.hexPreview,
          family: secondary.family,
          regions: [region.name],
        });
      } else {
        const info = colorMap.get(secondary.code)!;
        if (!info.regions.includes(region.name)) {
          info.regions.push(region.name);
        }
      }
    });
  });

  const colors = Array.from(colorMap.values());

  // Group by family
  const colorsByFamily = colors.reduce(
    (acc, color) => {
      if (!acc[color.family]) {
        acc[color.family] = [];
      }
      acc[color.family].push(color);
      return acc;
    },
    {} as Record<string, ColorInfo[]>
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400" />
            complete color palette
          </CardTitle>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="text-xs h-7"
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="text-xs h-7"
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Grid view */}
        {viewMode === "grid" && (
          <div>
            {Object.entries(colorsByFamily).map(([family, familyColors]) => (
              <div key={family} className="mb-3 last:mb-0">
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-0.5">
                  {family}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {familyColors.map((color) => (
                    <button
                      key={color.code}
                      onClick={() => handleCopy(color.code)}
                      className="group relative text-left transition-all hover:ring-2 hover:ring-primary/50"
                      title={`${color.code} - ${color.name}`}
                    >
                      {/* Color swatch */}
                      <div 
                        className="relative rounded border border-border/50 group-hover:border-primary/50"
                        style={{ width: '50px', height: '50px' }}
                      >
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          {copiedCode === color.code ? (
                            <Check className="w-3 h-3 text-white drop-shadow" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 text-white drop-shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                          <div className="bg-black/80 text-white text-[10px] px-2 py-1 rounded">
                            {color.code}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List view */}
        {viewMode === "list" && (
          <div className="space-y-2">
            {colors.map((color) => (
              <button
                key={color.code}
                onClick={() => handleCopy(color.code)}
                className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all"
              >
                {/* Color swatch */}
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 border border-border ring-1 ring-border/20"
                  style={{ backgroundColor: color.hex }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-semibold text-sm">{color.code}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {color.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60">
                    {color.regions.join(", ")}
                  </p>
                </div>

                {/* Copy indicator */}
                {copiedCode === color.code ? (
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
