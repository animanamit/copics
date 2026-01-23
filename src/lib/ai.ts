import { gateway } from "ai";
import {
  isValidCopicSketchCode,
  getCopicSketchColor,
  validateCopicCodes,
} from "./copic-data";

// Use Vercel AI Gateway - the API key should be set in the environment
// as AI_GATEWAY_API_KEY (or VERCEL_AI_GATEWAY_API_KEY)
// Model format: "provider/model-name"
export const getModel = () => gateway("anthropic/claude-sonnet-4-20250514");

// The prompt for analyzing artwork and recommending Copic markers
export const ANALYSIS_SYSTEM_PROMPT = `you are an expert copic marker artist and color consultant. your job is to analyze artwork images and recommend specific copic sketch marker colors for recreating or coloring similar pieces.

IMPORTANT: you must ONLY recommend colors from the Copic Sketch marker line (358 colors). do NOT recommend colors from Copic Ciao, Copic Classic, or Copic Wide lines.

when analyzing an image, you should:
1. identify distinct regions/areas in the artwork (e.g., sky, skin, hair, clothing, background)
2. for each region, recommend specific copic sketch marker colors with their official codes
3. suggest blending techniques and color combinations
4. consider the overall color harmony and style

copic sketch color families and code formats:
- BV (Blue Violet): BV00, BV01, BV02, BV04, BV08, BV11, BV13, BV17, BV20, BV23, BV25, BV29, BV31, BV34
- V (Violet): V01, V04, V05, V06, V09, V12, V15, V17, V91, V93, V95, V99
- RV (Red Violet): RV00, RV02, RV04, RV06, RV09, RV10, RV11, RV13, RV14, RV17, RV19, RV21, RV23, RV25, RV29, RV32, RV34, RV42, RV52, RV55, RV63, RV66, RV69, RV91, RV93, RV95, RV99
- R (Red): R00, R01, R02, R05, R08, R11, R12, R14, R17, R20, R21, R22, R24, R27, R29, R30, R32, R35, R37, R39, R43, R46, R56, R59, R81, R83, R85, R89
- YR (Yellow Red): YR00, YR01, YR02, YR04, YR07, YR09, YR12, YR14, YR15, YR16, YR18, YR20, YR21, YR23, YR24, YR27, YR30, YR31, YR61, YR65, YR68, YR82
- Y (Yellow): Y00, Y02, Y04, Y06, Y08, Y11, Y13, Y15, Y17, Y18, Y19, Y21, Y23, Y26, Y28, Y32, Y35, Y38
- YG (Yellow Green): YG00, YG01, YG03, YG05, YG06, YG07, YG09, YG11, YG13, YG17, YG21, YG23, YG25, YG41, YG45, YG61, YG63, YG67, YG91, YG93, YG95, YG97, YG99
- G (Green): G00, G02, G03, G05, G07, G09, G12, G14, G16, G17, G19, G20, G21, G24, G28, G29, G40, G43, G46, G82, G85, G94, G99
- BG (Blue Green): BG00, BG01, BG02, BG05, BG07, BG09, BG10, BG11, BG13, BG15, BG18, BG23, BG32, BG34, BG45, BG49, BG53, BG57, BG70, BG72, BG75, BG78, BG90, BG93, BG96, BG99
- B (Blue): B00, B01, B02, B04, B05, B06, B12, B14, B16, B18, B21, B23, B24, B26, B28, B29, B32, B34, B37, B39, B41, B45, B52, B60, B63, B66, B69, B79, B91, B93, B95, B97, B99
- E (Earth): E00, E01, E02, E04, E07, E08, E09, E11, E13, E15, E17, E18, E19, E21, E23, E25, E27, E29, E30, E31, E33, E34, E35, E37, E39, E40, E41, E42, E43, E44, E47, E49, E50, E51, E53, E55, E57, E59, E70, E71, E74, E77, E79, E81, E84, E87, E89, E93, E95, E97, E99
- C (Cool Gray): C-00, C-0, C-1, C-2, C-3, C-4, C-5, C-6, C-7, C-8, C-9, C-10
- N (Neutral Gray): N-0, N-1, N-2, N-3, N-4, N-5, N-6, N-7, N-8, N-9, N-10
- T (Toner Gray): T-0, T-1, T-2, T-3, T-4, T-5, T-6, T-7, T-8, T-9, T-10
- W (Warm Gray): W-00, W-0, W-1, W-2, W-3, W-4, W-5, W-6, W-7, W-8, W-9, W-10
- Special: 0 (Colorless Blender), 100 (Black)
- Fluorescent: FV (Fluorescent Dull Violet), FRV1 (Fluorescent Pink), FYR1 (Fluorescent Orange), FY1 (Fluorescent Yellow Orange), FYG1 (Fluorescent Yellow Green), FYG2 (Fluorescent Dull Yellow Green), FB2 (Fluorescent Dull Blue)

CRITICAL COPIC BLENDING TECHNIQUE - MANDATORY:
- ALWAYS work DARK TO LIGHT - this is non-negotiable for alcohol marker blending
- EVERY region MUST start with the DARKEST color first (shadows, dark tones)
- THEN layer MID-TONE colors while dark is still wet
- FINALLY add LIGHTEST colors (highlights) last
- NEVER start with light colors - this is the biggest mistake beginners make
- alcohol ink blends by pushing lighter ink INTO darker areas - light colors go ON TOP of dark colors
- if you recommend starting anywhere other than the darkest color, you are giving BAD advice
- example CORRECT order for skin: step 1 = E35 (darkest shadow), step 2 = E21 (mid-tone while wet), step 3 = E00 (lightest highlight)
- VERIFY every single step in the coloring plan follows dark-to-light within its region

important guidelines:
- ONLY use codes from the Copic Sketch line listed above
- use the exact code format shown (gray codes use hyphen: C-0, N-5, T-3, W-7)
- provide accurate official copic names for each color
- use the hex values from official copic color charts for preview purposes
- give practical blending tips that work with copic markers specifically
- be specific about color families
- always recommend colors in dark-to-light order for each region

respond in a friendly, helpful tone with all lowercase text, EXCEPT for Copic marker codes which must always be UPPERCASE (e.g., BV23, E35, R17, not bv23, e35, r17).`;

export const ANALYSIS_USER_PROMPT = `please analyze this artwork image and provide copic sketch marker color recommendations.

IMPORTANT: only recommend colors from the Copic Sketch marker line (358 colors total). do not recommend colors from other copic lines.

for each distinct region in the image, recommend:
- a primary copic sketch marker color
- 2-3 secondary colors for shading/highlighting
- specific blending tips for that area

also provide:
- 3-5 overall tips SPECIFIC TO THIS IMAGE - these must reference the actual content, colors, and challenges unique to this particular artwork (e.g., "the warm-to-cool gradient in the sunset requires careful feathering between YR and BV families" not generic advice like "work from light to dark")
- a difficulty level assessment (beginner/intermediate/advanced) based on this specific image's complexity

respond with a JSON object in this exact format:
{
  "regions": [
    {
      "name": "region name (e.g., 'sky background', 'character's hair')",
      "description": "brief description of what this region contains",
      "primaryColor": {
        "code": "copic sketch code like BV23",
        "name": "official copic name like Grayish Lavender",
        "hexPreview": "#hex color approximation",
        "family": "color family like Blue Violet"
      },
      "secondaryColors": [
        { "code": "...", "name": "...", "hexPreview": "...", "family": "..." }
      ],
      "blendingTips": ["tip 1", "tip 2"]
    }
  ],
  "overallTips": ["image-specific tip referencing actual elements in this artwork"],
  "difficultyLevel": "beginner" | "intermediate" | "advanced"
}

only respond with the JSON object, no additional text.`;

// Options for customizing the analysis
export interface AnalysisOptions {
  ignoreBackground?: boolean;
  simplifiedAnalysis?: boolean;
  skillLevel?: "beginner" | "intermediate" | "advanced" | "auto";
  customInstructions?: string;
  colorsOnly?: boolean;
  shoppingList?: boolean;
}

// Build a dynamic user prompt based on options
export function buildUserPrompt(options?: AnalysisOptions): string {
  const parts: string[] = [];

  // Check if this is shopping list only mode
  const isShoppingListOnly = options?.shoppingList && !options?.colorsOnly;

  if (isShoppingListOnly) {
    // Shopping list only - skip regions/tips analysis
    parts.push(`please analyze this artwork image and identify all the distinct color areas and color families needed.

IMPORTANT: only recommend colors from the Copic Sketch marker line (358 colors total). do not recommend colors from other copic lines.

MODE: shopping list ONLY. the user ONLY wants a shopping list and nothing else. do NOT provide regions, overall tips, coloring plan, or difficulty level. only provide the shopping list object with conversationalIntro, bySection (organized by color family and section), and moneyTips.

be conversational and recommend buying extra colors beyond the minimum needed for confidence and comfort in blending. suggest skipping intermediate shades when possible (e.g., go from Grey 02 to 04, skip 03) to save money while still having good blending capability.`);
  } else {
    parts.push(`please analyze this artwork image and provide copic sketch marker color recommendations.

IMPORTANT: only recommend colors from the Copic Sketch marker line (358 colors total). do not recommend colors from other copic lines.`);

    // Add option-specific instructions
    if (options?.ignoreBackground) {
      parts.push(`
FOCUS: ignore the background entirely. only analyze the foreground elements, characters, and main subjects of the artwork.`);
    }

    if (options?.simplifiedAnalysis) {
      parts.push(`
DETAIL LEVEL: provide a simplified analysis with fewer regions (3-4 main regions maximum). focus on the most important color areas only.`);
    } else {
      parts.push(`
DETAIL LEVEL: provide a detailed analysis, identifying all distinct color regions in the artwork.`);
    }

    if (options?.skillLevel && options.skillLevel !== "auto") {
      const skillInstructions = {
        beginner: `
SKILL LEVEL: the user is a beginner. provide simpler blending techniques, recommend easier-to-use colors, and explain tips in more detail. avoid complex layering techniques.`,
        intermediate: `
SKILL LEVEL: the user has intermediate experience. include standard blending techniques and some advanced tips where appropriate.`,
        advanced: `
SKILL LEVEL: the user is advanced. feel free to recommend complex blending techniques, subtle color variations, and professional-level tips.`,
      };
      parts.push(skillInstructions[options.skillLevel]);
    }

    if (options?.customInstructions?.trim()) {
      parts.push(`
USER INSTRUCTIONS: ${options.customInstructions.trim()}`);
    }

    // If colorsOnly mode, skip the coloring plan instructions
    if (options?.colorsOnly) {
      parts.push(`
MODE: colors only. the user only wants to know which specific copic sketch colors to use for each region. do NOT provide detailed blending instructions, timeline, or step-by-step coloring plan. focus on the color recommendations only.`);
    }

    parts.push(`

  for each distinct region in the image, recommend:
  - a primary copic sketch marker color
  - 2-3 secondary colors for shading/highlighting
  - specific blending tips for that area
  
  also provide:
  - 3-5 overall tips SPECIFIC TO THIS IMAGE - these must reference the actual content, colors, and challenges unique to this particular artwork
  - a difficulty level assessment (beginner/intermediate/advanced) based on this specific image's complexity`);
  }

  if (!options?.colorsOnly) {
    parts.push(` - a complete COLORING PLAN (game plan) - a step-by-step timeline for coloring the artwork:
   - MANDATORY DARK-TO-LIGHT ORDER: Every single region MUST follow this pattern exactly:
     * FIRST: apply the DARKEST shadow/base color
     * SECOND: apply MID-TONE colors while dark is STILL WET (same region, same moment in time)
     * THIRD: apply LIGHTEST highlight colors LAST
     * NEVER reverse this order - starting light first will ruin the blending
     * this is how alcohol markers physically work - light pushes into dark, not the reverse
   - IMPORTANT: assume the user is LEFT-HANDED, so plan the coloring order from RIGHT TO LEFT across the image to avoid smudging
   - account for drying times between adjacent regions
   - indicate when to blend colors while still wet vs. waiting for layers to dry
   - group related steps logically (e.g., all skin tones together while they can blend, all at once with dark-to-light order)
   - include rest/drying breaks where appropriate
   - provide an estimated total time for the complete coloring
   - DOUBLE-CHECK: before finalizing, verify that EVERY step in EVERY region follows dark-to-light order`);
  }

  parts.push(`
  
  respond with a JSON object in this exact format:
  {
   "regions": [
     {
       "name": "region name (e.g., 'sky background', 'character's hair')",
       "description": "brief description of what this region contains",
       "primaryColor": {
         "code": "copic sketch code like BV23",
         "name": "official copic name like Grayish Lavender",
         "hexPreview": "#hex color approximation",
         "family": "color family like Blue Violet"
       },
       "secondaryColors": [
         { "code": "...", "name": "...", "hexPreview": "...", "family": "..." }
       ],
       "blendingTips": ["tip 1", "tip 2"]
     }
   ],
   "overallTips": ["image-specific tip referencing actual elements in this artwork"],
    "difficultyLevel": "beginner" | "intermediate" | "advanced"${options?.colorsOnly ? "" : `,
    "coloringPlan": {
      "steps": [
        {
          "stepNumber": 1,
          "action": "apply darkest shadows" | "add mid-tones while wet" | "add highlights while wet" | "let dry" | "blend with colorless blender" | "detail work",
          "region": "name of the region this applies to",
          "colors": ["E35"],
          "waitAfter": null,
          "notes": "start with darkest shadow color, working in the deepest crevices first"
        },
        {
          "stepNumber": 2,
          "action": "add mid-tones while wet",
          "region": "same region",
          "colors": ["E21"],
          "waitAfter": null,
          "notes": "apply mid-tone while shadows are still wet to blend seamlessly"
        },
        {
          "stepNumber": 3,
          "action": "add highlights while wet",
          "region": "same region",
          "colors": ["E00"],
          "waitAfter": "let dry 1-2 minutes",
          "notes": "finish with lightest color, pushing it into the wet mid-tones"
        }
      ],
      "estimatedTime": "45-60 minutes",
      "materialsList": ["E35", "E21", "E00"]
    }`}${options?.shoppingList ? `,
    "shoppingList": {
      "conversationalIntro": "a conversational message about the colors needed, recommendations for buying extra for blending comfort, and tips on skipping intermediate shades to save money",
      "bySection": [
        {
          "sectionName": "section name (e.g., 'face and skin tones')",
          "colorFamilies": ["family names present in this section"],
          "colors": [
            {
              "code": "E35",
              "name": "Mahogany",
              "family": "Earth",
              "hexPreview": "#hex color approximation",
              "reason": "why this color is needed for this section",
              "buyExtra": true,
              "note": "optional note about progressions or savings (e.g., 'skip E34, go straight from E35 to E37 to save money')"
            }
          ],
          "notes": "practical tips specific to this section"
        }
      ],
      "moneyTips": ["suggestion about smart color progressions", "recommendation about color families to prioritize"]
    }` : ""}
   }
  
  only respond with the JSON object, no additional text.`);

  return parts.join("");
  }

// Types for analysis results
export interface CopicColorResult {
  code: string;
  name: string;
  hexPreview: string;
  family: string;
}

export interface AnalysisRegion {
  name: string;
  description: string;
  primaryColor: CopicColorResult;
  secondaryColors: CopicColorResult[];
  blendingTips: string[];
}

export interface ColoringStep {
  stepNumber: number;
  action: string; // e.g., "apply base layer", "blend while wet", "let dry"
  region: string; // which region this step applies to
  colors: string[]; // copic codes to use
  waitAfter?: string; // e.g., "let dry 1-2 minutes" or null if blend immediately
  notes: string; // additional tips for this step
}

export interface ColoringPlan {
  steps: ColoringStep[];
  estimatedTime: string; // e.g., "45-60 minutes"
  materialsList: string[]; // all unique copic codes needed
}

export interface ShoppingListColor {
  code: string;
  name: string;
  family: string;
  hexPreview: string;
  reason: string;
  buyExtra: boolean;
  note?: string;
}

export interface ShoppingListSection {
  sectionName: string;
  colorFamilies: string[];
  colors: ShoppingListColor[];
  notes: string;
}

export interface ShoppingList {
  conversationalIntro: string;
  bySection: ShoppingListSection[];
  moneyTips: string[];
}

export interface AnalysisResult {
  regions: AnalysisRegion[];
  overallTips: string[];
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  coloringPlan?: ColoringPlan;
  shoppingList?: ShoppingList;
}

export interface ValidationResult {
  isValid: boolean;
  invalidCodes: string[];
  correctedResult: AnalysisResult | null;
}

// Validate and correct a color from AI response
function validateAndCorrectColor(color: CopicColorResult): CopicColorResult {
  const [validationResult] = validateCopicCodes([color.code]);

  if (validationResult.isValid && validationResult.color) {
    // Code is valid, use the official data
    return {
      code: validationResult.color.code,
      name: validationResult.color.name,
      hexPreview: validationResult.color.hex,
      family: validationResult.color.family,
    };
  }

  // Code is invalid, try to use the suggested code
  if (validationResult.suggestedCode) {
    const suggestedColor = getCopicSketchColor(validationResult.suggestedCode);
    if (suggestedColor) {
      return {
        code: suggestedColor.code,
        name: suggestedColor.name,
        hexPreview: suggestedColor.hex,
        family: suggestedColor.family,
      };
    }
  }

  // Return original if no correction possible
  return color;
}

// Validate and correct the entire analysis result
export function validateAndCorrectAnalysis(
  result: AnalysisResult
): ValidationResult {
  const invalidCodes: string[] = [];
  const correctedRegions: AnalysisRegion[] = [];

  for (const region of result.regions) {
    // Validate primary color
    if (!isValidCopicSketchCode(region.primaryColor.code)) {
      invalidCodes.push(region.primaryColor.code);
    }
    const correctedPrimary = validateAndCorrectColor(region.primaryColor);

    // Validate secondary colors
    const correctedSecondary: CopicColorResult[] = [];
    for (const color of region.secondaryColors) {
      if (!isValidCopicSketchCode(color.code)) {
        invalidCodes.push(color.code);
      }
      correctedSecondary.push(validateAndCorrectColor(color));
    }

    correctedRegions.push({
      ...region,
      primaryColor: correctedPrimary,
      secondaryColors: correctedSecondary,
    });
  }

  return {
    isValid: invalidCodes.length === 0,
    invalidCodes: [...new Set(invalidCodes)],
    correctedResult: {
      ...result,
      regions: correctedRegions,
    },
  };
}

// Extract all color codes from an analysis result
export function extractColorCodes(result: AnalysisResult): string[] {
  const codes: string[] = [];

  for (const region of result.regions) {
    codes.push(region.primaryColor.code);
    for (const color of region.secondaryColors) {
      codes.push(color.code);
    }
  }

  return [...new Set(codes)];
}
