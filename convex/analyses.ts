import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new analysis record
export const create = mutation({
  args: {
    userId: v.string(),
    imageName: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const analysisId = await ctx.db.insert("analyses", {
      userId: args.userId,
      imageName: args.imageName,
      imageStorageId: args.imageStorageId,
      imageUrl: args.imageUrl,
      name: args.name,
      status: "pending",
    });
    return analysisId;
  },
});

// Create a batch analysis record (for multiple images)
export const createBatch = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    fileCount: v.number(),
  },
  handler: async (ctx, args) => {
    const analysisId = await ctx.db.insert("analyses", {
      userId: args.userId,
      imageName: `${args.name} (batch of ${args.fileCount})`,
      name: args.name,
      status: "pending",
    });
    return analysisId;
  },
});

// Get a single analysis by ID
export const get = query({
  args: { id: v.id("analyses") },
  handler: async (ctx, args) => {
    const analysis = await ctx.db.get(args.id);
    if (!analysis) return null;

    // If we have a storage ID, get the URL
    let imageUrl = analysis.imageUrl;
    if (analysis.imageStorageId) {
      imageUrl = await ctx.storage.getUrl(analysis.imageStorageId) || undefined;
    }

    return {
      ...analysis,
      imageUrl,
    };
  },
});

// Get analysis by ID with user check
export const getByIdForUser = query({
  args: {
    id: v.id("analyses"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const analysis = await ctx.db.get(args.id);
    if (!analysis || analysis.userId !== args.userId) return null;

    // If we have a storage ID, get the URL
    let imageUrl = analysis.imageUrl;
    if (analysis.imageStorageId) {
      imageUrl = await ctx.storage.getUrl(analysis.imageStorageId) || undefined;
    }

    return {
      ...analysis,
      imageUrl,
    };
  },
});

// List analyses for a user
export const listForUser = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const analyses = await ctx.db
      .query("analyses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);

    // Get URLs for all analyses with storage IDs
    const analysesWithUrls = await Promise.all(
      analyses.map(async (analysis) => {
        let imageUrl = analysis.imageUrl;
        if (analysis.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(analysis.imageStorageId) || undefined;
        }
        return {
          ...analysis,
          imageUrl,
        };
      })
    );

    return analysesWithUrls;
  },
});

// Update analysis status
export const updateStatus = mutation({
  args: {
    id: v.id("analyses"),
    status: v.union(
      v.literal("pending"),
      v.literal("analyzing"),
      v.literal("completed"),
      v.literal("failed")
    ),
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
        shoppingList: v.optional(
          v.object({
            conversationalIntro: v.string(),
            bySection: v.array(
              v.object({
                sectionName: v.string(),
                colorFamilies: v.array(v.string()),
                colors: v.array(
                  v.object({
                    code: v.string(),
                    name: v.string(),
                    family: v.string(),
                    hexPreview: v.string(),
                    reason: v.string(),
                    buyExtra: v.boolean(),
                    note: v.optional(v.string()),
                  })
                ),
                notes: v.string(),
              })
            ),
            moneyTips: v.array(v.string()),
          })
        ),
      })
    ),
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
        colorsOnly: v.optional(v.boolean()),
        shoppingList: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { id, status, result, options } = args;

    const updateData: {
      status: typeof status;
      result?: typeof result;
      options?: typeof options;
    } = { status };

    if (result) {
      updateData.result = result;
    }

    if (options) {
      updateData.options = options;
    }

    await ctx.db.patch(id, updateData);
  },
});

// Update analysis name
export const updateName = mutation({
  args: {
    id: v.id("analyses"),
    userId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const analysis = await ctx.db.get(args.id);

    if (!analysis || analysis.userId !== args.userId) {
      throw new Error("Analysis not found or unauthorized");
    }

    await ctx.db.patch(args.id, { name: args.name });
  },
});

// Delete an analysis
export const remove = mutation({
  args: {
    id: v.id("analyses"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const analysis = await ctx.db.get(args.id);

    if (!analysis || analysis.userId !== args.userId) {
      throw new Error("Analysis not found or unauthorized");
    }

    // Delete the stored image if it exists
    if (analysis.imageStorageId) {
      await ctx.storage.delete(analysis.imageStorageId);
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Generate upload URL for image
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
