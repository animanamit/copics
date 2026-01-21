"use client";

import { Badge } from "@/components/ui/badge";

interface CopicColor {
  code: string;
  name: string;
  hexPreview: string;
  family: string;
}

interface CopicColorCardProps {
  color: CopicColor;
  isPrimary?: boolean;
}

export function CopicColorCard({ color, isPrimary = false }: CopicColorCardProps) {
  return (
    <div
      className={`
        group relative flex items-center gap-3 p-3 rounded-2xl
        transition-all duration-200
        ${isPrimary ? "bg-pastel-lavender/30" : "bg-muted/50 hover:bg-muted"}
      `}
    >
      {/* Color swatch */}
      <div
        className="w-12 h-12 rounded-xl flex-shrink-0 ring-1 ring-border/20"
        style={{ backgroundColor: color.hexPreview }}
      />

      {/* Color info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold">{color.code}</span>
          {isPrimary && (
            <Badge variant="secondary" className="text-xs">
              primary
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{color.name}</p>
        <p className="text-xs text-muted-foreground/70">{color.family}</p>
      </div>

      {/* Hex value on hover */}
      <span className="text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        {color.hexPreview}
      </span>
    </div>
  );
}

interface CopicColorListProps {
  primaryColor: CopicColor;
  secondaryColors: CopicColor[];
}

export function CopicColorList({
  primaryColor,
  secondaryColors,
}: CopicColorListProps) {
  return (
    <div className="space-y-2">
      <CopicColorCard color={primaryColor} isPrimary />
      {secondaryColors.map((color, index) => (
        <CopicColorCard key={`${color.code}-${index}`} color={color} />
      ))}
    </div>
  );
}
