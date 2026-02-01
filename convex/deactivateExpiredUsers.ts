import { mutation } from "./_generated/server";

/**
 * Deactivate Expired Users Mutation
 *
 * Deactivates all users whose expiry date has passed.
 * This can be run periodically or on demand.
 *
 * @returns Number of users deactivated
 */
export const deactivateExpiredUsers = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      const now = Date.now();
      let deactivatedCount = 0;

      // Get all users with expiry dates
      const users = await ctx.db.query("users").collect();

      for (const user of users) {
        // Only process users with expiry dates who are still active
        if (user.expiryDate && user.isActive && now > user.expiryDate) {
          await ctx.db.patch(user._id, {
            isActive: false,
          });
          deactivatedCount++;
        }
      }

      return {
        success: true,
        deactivatedCount,
      };
    } catch (error) {
      console.error("Deactivate expired users error:", error);
      return {
        success: false,
        deactivatedCount: 0,
      };
    }
  },
});
