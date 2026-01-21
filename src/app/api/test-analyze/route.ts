import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel, ANALYSIS_SYSTEM_PROMPT, ANALYSIS_USER_PROMPT } from "@/lib/ai";
import type { AnalysisResult } from "@/lib/types";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "no image provided" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type;

    console.log("Analyzing image:", file.name, "Type:", mimeType, "Size:", bytes.byteLength);

    // Call Claude with vision capabilities via Vercel AI Gateway
    const { text } = await generateText({
      model: getModel(),
      system: ANALYSIS_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: `data:${mimeType};base64,${base64}`,
            },
            {
              type: "text",
              text: ANALYSIS_USER_PROMPT,
            },
          ],
        },
      ],
      maxOutputTokens: 4096,
    });

    console.log("AI Response:", text);

    // Parse the JSON response
    let result: AnalysisResult;
    try {
      // Clean up the response - remove any markdown code blocks if present
      let cleanedText = text.trim();
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.slice(7);
      }
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.slice(0, -3);
      }
      cleanedText = cleanedText.trim();

      result = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      return NextResponse.json(
        {
          error: "failed to parse analysis result",
          rawResponse: text
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Test analyze error:", error);
    return NextResponse.json(
      {
        error: "analysis failed",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
