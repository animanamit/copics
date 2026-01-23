"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Palette, Copy, Check } from "lucide-react";
import type { ShoppingList } from "@/lib/types";
import { formatShoppingListForCopy } from "@/lib/shopping-list-formatter";

interface ShoppingListDisplayProps {
  shoppingList: ShoppingList;
}

export function ShoppingListDisplay({
  shoppingList,
}: ShoppingListDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    const text = formatShoppingListForCopy(shoppingList);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const totalColors = shoppingList.bySection.reduce(
    (sum, section) => sum + section.colors.length,
    0
  );

  return (
    <Card className="bg-pastel-mint/20 border-0 animate-fade-up">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            shopping list
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-base">
              {totalColors} colors
            </Badge>
            <Button
              onClick={handleCopyToClipboard}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  copy
                </>
              )}
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {shoppingList.conversationalIntro}
        </p>

        {shoppingList.bySection && (
          <div className="space-y-6">
            {shoppingList.bySection.map((section, idx) => (
              <div key={idx}>
                <div className="mb-3">
                  <h3 className="font-semibold text-sm">{section.sectionName}</h3>
                  {section.colorFamilies.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Families: {section.colorFamilies.join(", ")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  {section.colors.map((color, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-2 rounded-lg bg-white/50"
                    >
                      <div
                        className="w-10 h-10 rounded-lg ring-1 ring-border/20 flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: color.hexPreview }}
                        role="img"
                        aria-label={`color swatch for ${color.name}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-semibold">
                            {color.code}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {color.family}
                          </span>
                          {color.buyExtra && (
                            <Badge variant="outline" className="text-xs">
                              buy extra
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {color.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {color.reason}
                        </p>
                        {color.note && (
                          <p className="text-xs text-amber-700 bg-amber-50/50 rounded p-1 mt-1">
                            {color.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {section.notes && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    {section.notes}
                  </p>
                )}
              </div>
            ))}

            {shoppingList.moneyTips &&
              shoppingList.moneyTips.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-semibold text-sm mb-3">💰 Money Tips</h4>
                  <ul className="space-y-2">
                    {shoppingList.moneyTips.map((tip, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
