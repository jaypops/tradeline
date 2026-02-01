import { query } from "./_generated/server";

/**
 * List Shareable Links Query
 *
 * Retrieves all shareable links with their status.
 *
 * @returns Array of shareable links
 */
export const listShareableLinks = query({
  args: {},
  handler: async (ctx) => {
    try {
      const links = await ctx.db.query("shareable_links").collect();
      const now = Date.now();

      return links.map((link) => ({
        id: link._id,
        token: link.token,
        startDate: link.startDate,
        expiryDate: link.expiryDate,
        isUsed: link.isUsed,
        userId: link.userId,
        createdAt: link.createdAt,
        isExpired: now > link.expiryDate,
        isNotYetActive: now < link.startDate,
      }));
    } catch (error) {
      console.error("List shareable links error:", error);
      return [];
    }
  },
});
