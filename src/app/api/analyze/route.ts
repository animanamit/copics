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
    const { analysisId, options, rerun, imageUrl: bodyImageUrl } = body as {
      analysisId: string;
      options?: AnalysisOptions;
      rerun?: boolean;
      imageUrl?: string;
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

    const imageUrl = analysis.imageUrl || bodyImageUrl;
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL not found in analysis record or request body" },
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
                image: imageUrl,
              },
              {
                type: "text",
                text: userPrompt,
              },
            ],
          },
        ],
        maxOutputTokens: 8192,
      });

      // Parse the JSON response
      let result: AnalysisResult;
      try {
        let cleanedText = text.trim();
        // Remove markdown code blocks
        if (cleanedText.startsWith("```json\n")) {
          cleanedText = cleanedText.slice(8);
        } else if (cleanedText.startsWith("```json")) {
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
        const errorMsg = parseError instanceof Error ? parseError.message : String(parseError);
        console.error("failed to parse AI response:", {
          error: errorMsg,
          textLength: text.length,
          firstChars: text.slice(0, 100),
          lastChars: text.slice(-100),
        });
        await fetchAuthMutation(api.analyses.updateStatus, {
          id: analysisId as Id<"analyses">,
          status: "failed",
        });
        return NextResponse.json(
          { error: "failed to parse analysis result", details: errorMsg },
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

      // Sanitize shopping list
      if (result.shoppingList) {
        result.shoppingList = {
          ...result.shoppingList,
          moneyTips: result.shoppingList.moneyTips ?? [],
          bySection: result.shoppingList.bySection.map((section) => ({
            ...section,
            notes: section.notes ?? "",
            colors: section.colors.map((color) => ({
              ...color,
              note: color.note ?? undefined,
            })),
          })),
        };
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
      const optionsToStore = options ? {
        ignoreBackground: options.ignoreBackground,
        simplifiedAnalysis: options.simplifiedAnalysis,
        skillLevel: options.skillLevel,
        customInstructions: options.customInstructions,
        colorsOnly: options.colorsOnly,
        shoppingList: options.shoppingList,
      } : undefined;

      await fetchAuthMutation(api.analyses.updateStatus, {
        id: analysisId as Id<"analyses">,
        status: "completed",
        result: finalResult,
        options: optionsToStore,
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
          details: errorMessage
        },
        { status: 500 }
      );
    }
    }
