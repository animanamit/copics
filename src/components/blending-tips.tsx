"use client";

import { Lightbulb, Sparkles } from "lucide-react";

interface BlendingTipsProps {
  tips: string[];
  title?: string;
}

export function BlendingTips({ tips, title = "blending tips" }: BlendingTipsProps) {
  if (!tips || tips.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Lightbulb className="w-4 h-4" />
        <span>{title}</span>
      </div>
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-foreground/80"
          >
            <span className="text-primary mt-0.5">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface OverallTipsProps {
  tips: string[];
  difficultyLevel: "beginner" | "intermediate" | "advanced";
}

export function OverallTips({ tips, difficultyLevel }: OverallTipsProps) {
  const difficultyColors = {
    beginner: "bg-pastel-mint text-green-700",
    intermediate: "bg-pastel-lemon text-yellow-700",
    advanced: "bg-pastel-peach text-orange-700",
  };

  return (
    <div className="rounded-2xl bg-pastel-lavender/20 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-medium">overall tips</span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[difficultyLevel]}`}
        >
          {difficultyLevel}
        </span>
      </div>
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-foreground/80"
          >
            <span className="text-primary mt-0.5">✦</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
