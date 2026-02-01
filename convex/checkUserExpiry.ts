import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Check User Expiry Status Query
 *
 * Checks if a user's access has expired based on their expiry date.
 *
 * @param userId - The user's ID
 * @returns Whether the user is expired and their expiry date
 */
export const checkUserExpiry = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db.get(args.userId);

      if (!user) {
        return {
          isExpired: true,
          expiryDate: null,
        };
      }

      // If no expiry date is set, user is not expired
      if (!user.expiryDate) {
        return {
          isExpired: false,
          expiryDate: null,
        };
      }

      const now = Date.now();
      const isExpired = now > user.expiryDate;

      return {
        isExpired,
        expiryDate: user.expiryDate,
      };
    } catch (error) {
      console.error("Check user expiry error:", error);
      return {
        isExpired: true,
        expiryDate: null,
      };
    }
  },
});
