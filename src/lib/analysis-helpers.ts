import type { AnalysisResult } from "@/lib/types";

export function getColorHex(
  code: string,
  regions: AnalysisResult["regions"]
): string | null {
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

export function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1a1a1a" : "#ffffff";
}
