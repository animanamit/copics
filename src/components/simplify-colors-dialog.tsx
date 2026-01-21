"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Wand2, Loader2, AlertCircle } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

interface SimplifyColorsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentColorCount: number;
  onSimplify: (maxColors: number) => Promise<void>;
  isLoading?: boolean;
}

export function SimplifyColorsDialog({
  isOpen,
  onOpenChange,
  currentColorCount,
  onSimplify,
  isLoading = false,
}: SimplifyColorsDialogProps) {
  const [maxColors, setMaxColors] = useState(
    Math.max(3, Math.floor(currentColorCount / 2))
  );

  const handleSimplify = async () => {
    await onSimplify(maxColors);
    onOpenChange(false);
  };

  const reduction = Math.round(
    ((currentColorCount - maxColors) / currentColorCount) * 100
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            simplify color palette
          </DialogTitle>
          <DialogDescription>
            reduce the number of colors to make the project more manageable
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current state */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    current palette
                  </p>
                  <p className="text-2xl font-bold">{currentColorCount} colors</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    reduction
                  </p>
                  <p className="text-2xl font-bold text-green-600">{reduction}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">colors to keep</label>
              <Badge variant="secondary" className="text-lg font-bold">
                {maxColors}
              </Badge>
            </div>
            <Slider
              value={[maxColors]}
              onValueChange={(value) => setMaxColors(value[0])}
              min={3}
              max={currentColorCount}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              use 3-4 colors for quick projects, 5-7 for balanced detail
            </p>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg px-3 py-3 border border-blue-200 dark:border-blue-800/50 flex gap-3">
            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-medium mb-1">ai will re-analyze your artwork</p>
              <p className="text-xs opacity-90">
                focusing on the most impactful colors and simplifying regions where
                possible while maintaining color harmony.
              </p>
            </div>
          </div>

          {/* Quick presets */}
          <div className="space-y-2">
            <p className="text-sm font-medium">quick presets</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMaxColors(4)}
                className="text-xs"
              >
                minimal (4)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMaxColors(6)}
                className="text-xs"
              >
                balanced (6)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMaxColors(8)}
                className="text-xs"
              >
                detailed (8)
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            cancel
          </Button>
          <Button
            onClick={handleSimplify}
            disabled={isLoading || maxColors === currentColorCount}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                re-analyzing...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                simplify
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
