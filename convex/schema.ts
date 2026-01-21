import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  analyses: defineTable({
    // User identification (from Clerk)
    userId: v.string(),

    // Image data
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    imageName: v.string(),
    name: v.optional(v.string()), // User-provided name for the analysis

    // Analysis options used (stored to re-contextualize results)
    options: v.optional(
      v.object({
        ignoreBackground: v.optional(v.boolean()),
        simplifiedAnalysis: v.optional(v.boolean()),
        skillLevel: v.optional(
          v.union(
            v.literal("beginner"),
            v.literal("intermediate"),
            v.literal("advanced"),
            v.literal("auto")
          )
        ),
        customInstructions: v.optional(v.string()),
      })
    ),

    // Analysis status
    status: v.union(
      v.literal("pending"),
      v.literal("analyzing"),
      v.literal("completed"),
      v.literal("failed")
    ),

    // Analysis result (optional, populated when completed)
    result: v.optional(
      v.object({
        regions: v.array(
          v.object({
            name: v.string(),
            description: v.string(),
            primaryColor: v.object({
              code: v.string(),
              name: v.string(),
              hexPreview: v.string(),
              family: v.string(),
            }),
            secondaryColors: v.array(
              v.object({
                code: v.string(),
                name: v.string(),
                hexPreview: v.string(),
                family: v.string(),
              })
            ),
            blendingTips: v.array(v.string()),
          })
        ),
        overallTips: v.array(v.string()),
        difficultyLevel: v.union(
          v.literal("beginner"),
          v.literal("intermediate"),
          v.literal("advanced")
        ),
        coloringPlan: v.optional(
          v.object({
            steps: v.array(
              v.object({
                stepNumber: v.number(),
                action: v.string(),
                region: v.string(),
                colors: v.array(v.string()),
                waitAfter: v.optional(v.string()),
                notes: v.string(),
              })
            ),
            estimatedTime: v.string(),
            materialsList: v.array(v.string()),
          })
        ),
      })
    ),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"]),
});
