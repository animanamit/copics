// Analysis types used throughout the app

export type AnalysisStatus = "pending" | "analyzing" | "completed" | "failed";

export interface CopicColor {
  code: string;
  name: string;
  hexPreview: string;
  family: string;
}

export interface AnalysisRegion {
  name: string;
  description: string;
  primaryColor: CopicColor;
  secondaryColors: CopicColor[];
  blendingTips: string[];
}

export interface ColoringStep {
  stepNumber: number;
  action: string;
  region: string;
  colors: string[];
  waitAfter?: string;
  notes: string;
}

export interface ColoringPlan {
  steps: ColoringStep[];
  estimatedTime: string;
  materialsList: string[];
}

export interface ShoppingListSection {
  sectionName: string;
  colorFamilies: string[];
  colors: Array<CopicColor & { reason: string; buyExtra: boolean; note?: string }>;
  notes: string;
}

export interface ShoppingList {
  conversationalIntro: string;
  sections: ShoppingListSection[];
  moneyTips: string[];
  totalColors?: number;
}

export interface AnalysisResult {
  regions: AnalysisRegion[];
  overallTips: string[];
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  coloringPlan?: ColoringPlan;
  shoppingList?: ShoppingList;
}

export interface Analysis {
  analysisId: string;
  userId: string;
  imageUrl: string;
  imageName: string;
  status: AnalysisStatus;
  result?: AnalysisResult;
  createdAt: number;
}
