"use client";

import { useState, useCallback } from "react";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalysisResult } from "@/lib/types";

export default function TestPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
      setResult(null);
      setError(null);
      setRawResponse(null);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);
    setRawResponse(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/test-analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Analysis failed");
        if (data.rawResponse) {
          setRawResponse(data.rawResponse);
        }
        if (data.details) {
          setError(`${data.error}: ${data.details}`);
        }
        return;
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">ai analysis test</h1>
          <p className="text-muted-foreground">
            upload an image to test the copic marker color analysis
          </p>
        </div>

        {/* Upload section */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileSelect}
                  className="flex-1"
                  id="file-input"
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isAnalyzing}
                  className="gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      analyze
                    </>
                  )}
                </Button>
              </div>

              {preview && (
                <div className="rounded-2xl overflow-hidden bg-muted/50 p-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto max-h-80 object-contain rounded-xl"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error display */}
        {error && (
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                <div className="space-y-2">
                  <p className="font-medium text-destructive">{error}</p>
                  {rawResponse && (
                    <details className="text-sm">
                      <summary className="cursor-pointer text-muted-foreground">
                        view raw ai response
                      </summary>
                      <pre className="mt-2 p-4 bg-muted rounded-lg overflow-auto text-xs">
                        {rawResponse}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results display */}
        {result && (
          <div className="space-y-6">
            {/* Overall info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>analysis results</CardTitle>
                  <Badge
                    className={
                      result.difficultyLevel === "beginner"
                        ? "bg-green-100 text-green-700"
                        : result.difficultyLevel === "intermediate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-orange-100 text-orange-700"
                    }
                  >
                    {result.difficultyLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    overall tips:
                  </p>
                  <ul className="space-y-1">
                    {result.overallTips.map((tip, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary">✦</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Regions */}
            <div className="grid gap-4 md:grid-cols-2">
              {result.regions.map((region, idx) => (
                <Card key={idx}>
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
                      <ColorCard color={region.primaryColor} />
                    </div>

                    {/* Secondary colors */}
                    {region.secondaryColors.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase">
                          secondary
                        </p>
                        <div className="space-y-2">
                          {region.secondaryColors.map((color, i) => (
                            <ColorCard key={i} color={color} />
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
                        <ul className="space-y-1">
                          {region.blendingTips.map((tip, i) => (
                            <li
                              key={i}
                              className="text-sm flex items-start gap-2"
                            >
                              <span className="text-primary">•</span>
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

            {/* Raw JSON for debugging */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">raw json response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-muted rounded-lg overflow-auto text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function ColorCard({
  color,
}: {
  color: { code: string; name: string; hexPreview: string; family: string };
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
      <div
        className="w-10 h-10 rounded-lg ring-1 ring-border/20 flex-shrink-0"
        style={{ backgroundColor: color.hexPreview }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold">{color.code}</span>
          <span className="text-xs text-muted-foreground">{color.family}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{color.name}</p>
      </div>
      <span className="text-xs font-mono text-muted-foreground">
        {color.hexPreview}
      </span>
    </div>
  );
}
