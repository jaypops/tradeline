import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Validate Shareable Link Query
 *
 * Validates a shareable link by checking:
 * 1. If the token exists
 * 2. If the link is within the valid date range
 * 3. If the link hasn't been used yet
 *
 * @param token - The token from the shareable link
 * @returns Validation result with link details
 */
export const validateShareableLink = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Find the link by token
      const link = await ctx.db
        .query("shareable_links")
        .withIndex("by_token", (q) => q.eq("token", args.token))
        .first();

      if (!link) {
        return {
          valid: false,
          error: "Invalid link",
        };
      }

      const now = Date.now();

      // Check if link has expired
      if (now > link.expiryDate) {
        return {
          valid: false,
          error: "This link has expired",
        };
      }

      // Check if link is not yet active
      if (now < link.startDate) {
        return {
          valid: false,
          error: "This link is not yet active",
        };
      }

      // Check if link has already been used
      if (link.isUsed) {
        return {
          valid: false,
          error: "This link has already been used",
        };
      }

      // Link is valid
      return {
        valid: true,
        startDate: link.startDate,
        expiryDate: link.expiryDate,
      };
    } catch (error) {
      console.error("Validate shareable link error:", error);
      return {
        valid: false,
        error: "An error occurred while validating the link",
      };
    }
  },
});
