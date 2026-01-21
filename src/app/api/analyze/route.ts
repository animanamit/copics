import { NextRequest, NextResponse } from "next/server";
import { fetchAuthQuery, fetchAuthMutation } from "@/lib/auth-server";
import { generateText } from "ai";
import { api } from "../../../../convex/_generated/api";
import {
  getModel,
  ANALYSIS_SYSTEM_PROMPT,
  buildUserPrompt,
  validateAndCorrectAnalysis,
  type AnalysisResult,
  type AnalysisOptions,
} from "@/lib/ai";
import type { Id } from "../../../../convex/_generated/dataModel";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Get the current authenticated user from Convex
    const user = await fetchAuthQuery(api.auth.getCurrentUser);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: No authenticated user found" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { analysisId, options, rerun } = body as {
      analysisId: string;
      options?: AnalysisOptions;
      rerun?: boolean;
    };

    if (!analysisId) {
      return NextResponse.json(
        { error: "Missing required field: analysisId" },
        { status: 400 }
      );
    }

    // Get the analysis record
    const analysis = await fetchAuthQuery(api.analyses.getByIdForUser, {
      id: analysisId as Id<"analyses">,
      userId: user._id,
    });

    if (!analysis) {
      return NextResponse.json(
        { error: `Analysis not found: ${analysisId}` },
        { status: 404 }
      );
    }

    if (analysis.status === "completed" && !rerun) {
      return NextResponse.json(
        { error: "Analysis already completed. Set rerun=true to re-analyze" },
        { status: 400 }
      );
    }

    if (analysis.status === "analyzing") {
      return NextResponse.json(
        { error: "Analysis already in progress. Please wait for it to complete" },
        { status: 400 }
      );
    }

    if (!analysis.imageUrl) {
      return NextResponse.json(
        { error: "Image URL not found in analysis record" },
        { status: 400 }
      );
    }

    // Update status to analyzing
    await fetchAuthMutation(api.analyses.updateStatus, {
      id: analysisId as Id<"analyses">,
      status: "analyzing",
    });

    try {
      // Build dynamic prompt based on options
      const userPrompt = buildUserPrompt(options);

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
                image: analysis.imageUrl,
              },
              {
                type: "text",
                text: userPrompt,
              },
            ],
          },
        ],
        maxOutputTokens: 4096,
      });

      // Parse the JSON response
      let result: AnalysisResult;
      try {
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
      } catch {
        console.error("failed to parse AI response:", text);
        await fetchAuthMutation(api.analyses.updateStatus, {
          id: analysisId as Id<"analyses">,
          status: "failed",
        });
        return NextResponse.json(
          { error: "failed to parse analysis result" },
          { status: 500 }
        );
      }

      // Sanitize null values to undefined (Convex doesn't accept null for optional fields)
      if (result.coloringPlan?.steps) {
        result.coloringPlan.steps = result.coloringPlan.steps.map((step) => ({
          ...step,
          waitAfter: step.waitAfter ?? undefined,
        }));
      }

      // Validate and correct Copic color codes
      const validation = validateAndCorrectAnalysis(result);
      if (!validation.isValid) {
        console.log(
          "corrected invalid copic codes:",
          validation.invalidCodes.join(", ")
        );
      }

      // Use the corrected result
      const finalResult = validation.correctedResult || result;

      // Update with completed status, result, and options used
      await fetchAuthMutation(api.analyses.updateStatus, {
        id: analysisId as Id<"analyses">,
        status: "completed",
        result: finalResult,
        options: options ? {
          ignoreBackground: options.ignoreBackground,
          simplifiedAnalysis: options.simplifiedAnalysis,
          skillLevel: options.skillLevel,
          customInstructions: options.customInstructions,
        } : undefined,
      });

      return NextResponse.json({
        success: true,
        analysisId,
        result: finalResult,
        validation: {
          hadInvalidCodes: !validation.isValid,
          correctedCodes: validation.invalidCodes,
        },
      });
    } catch (aiError) {
      console.error("AI analysis error:", aiError);
      const errorMessage = aiError instanceof Error ? aiError.message : String(aiError);
      await fetchAuthMutation(api.analyses.updateStatus, {
        id: analysisId as Id<"analyses">,
        status: "failed",
      });
      return NextResponse.json(
        { 
          error: "AI analysis failed",
          details: errorMessage,
          analysisId
        },
        { status: 500 }
      );
    }
    } catch (error) {
    console.error("analyze error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        error: "Failed to process analysis",
        details: errorMessage,
        analysisId
      },
      { status: 500 }
    );
    }
    }
