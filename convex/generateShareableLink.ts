import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Generate Shareable Link Mutation
 * 
 * Creates a new shareable link with the specified start and expiry dates.
 * Generates a unique token for the link.
 * 
 * @param startDate - Start date for the link (ms since epoch)
 * @param expiryDate - Expiry date for the link (ms since epoch)
 * @returns Success status and the generated token
 */

export const generateShareableLink = mutation({
  args: {
    startDate: v.number(),
    expiryDate: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      // Validate dates
      const now = Date.now();
      // Start date can be now or in the past (for immediate access)
      // Only check if it's unreasonably far in the past (more than 1 year)
      const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);
      if (args.startDate < oneYearAgo) {
        return {
          success: false,
          token: null,
          error: "Start date cannot be more than 1 year in the past",
        };
      }

      if (args.expiryDate <= args.startDate) {
        return {
          success: false,
          token: null,
          error: "Expiry date must be after start date",
        };
      }

      // Generate a unique token (16 characters)
      const token =
        Math.random().toString(36).substring(2, 10) +
        Math.random().toString(36).substring(2, 10);

      // Check if token already exists (very unlikely but possible)
      const existingLink = await ctx.db
        .query("shareable_links")
        .withIndex("by_token", (q) => q.eq("token", token))
        .first();

      if (existingLink) {
        return {
          success: false,
          token: null,
          error: "Failed to generate unique token",
        };
      }

      // Insert new shareable link
      await ctx.db.insert("shareable_links", {
        token,
        startDate: args.startDate,
        expiryDate: args.expiryDate,
        isUsed: false,
        userId: undefined,
        createdAt: now,
      });

      return {
        success: true,
        token,
      };
    } catch (error) {
      console.error("Generate shareable link error:", error);
      return {
        success: false,
        token: null,
        error: "An error occurred while generating the link",
      };
    }
  },
});
