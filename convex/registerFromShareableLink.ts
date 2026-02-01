import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Register User from Shareable Link Mutation
 *
 * Creates a new user account using a valid shareable link.
 * Marks the link as used and associates it with the new user.
 *
 * @param token - The token from the shareable link
 * @param name - User's full name
 * @param email - User's email address
 * @param password - User's password
 * @returns Success status and the new user's ID
 */
export const registerFromShareableLink = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    email: v.string(),
    password: v.string(),
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
          success: false,
          userId: null,
          error: "Invalid link",
        };
      }

      const now = Date.now();

      // Check if link has expired
      if (now > link.expiryDate) {
        return {
          success: false,
          userId: null,
          error: "This link has expired",
        };
      }

      // Check if link is not yet active
      if (now < link.startDate) {
        return {
          success: false,
          userId: null,
          error: "This link is not yet active",
        };
      }

      // Check if link has already been used
      if (link.isUsed) {
        return {
          success: false,
          userId: null,
          error: "This link has already been used",
        };
      }

      // Check if user with this email already exists
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (existingUser) {
        return {
          success: false,
          userId: null,
          error: "Email already in use",
        };
      }

      // Create new user
      const userId = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        passwordHash: args.password,
        isActive: true,
        lastLogin: now,
        createdAt: now,
        startDate: link.startDate,
        expiryDate: link.expiryDate,
      });

      // Mark the link as used and associate with the user
      await ctx.db.patch(link._id, {
        isUsed: true,
        userId,
      });

      return {
        success: true,
        userId,
      };
    } catch (error) {
      console.error("Register from shareable link error:", error);
      return {
        success: false,
        userId: null,
        error: "An error occurred while registering",
      };
    }
  },
});
