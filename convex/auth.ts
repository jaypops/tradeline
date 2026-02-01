import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Authentication Module
 * 
 * Provides user authentication functionality including login.
 * For MVP, passwords are stored as plain text.
 * TODO: Add bcrypt hashing for production use.
 */

/**
 * Login Mutation
 * 
 * Authenticates a user by email and password.
 * Updates the lastLogin timestamp on successful authentication.
 * 
 * @param email - User's email address
 * @param password - User's password (plain text for MVP)
 * @returns Success status and user information (without password)
 */
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Find user by email using the index
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      // Check if user exists
      if (!user) {
        return {
          success: false,
          user: null,
        };
      }

      // Check if user account is active
      if (!user.isActive) {
        return {
          success: false,
          user: null,
          error: "Account is inactive",
        };
      }

      // Check if user account has expired
      const now = Date.now();
      if (user.expiryDate && now > user.expiryDate) {
        // Deactivate the user since they have expired
        await ctx.db.patch(user._id, {
          isActive: false,
        });
        return {
          success: false,
          user: null,
          error: "Account has expired",
        };
      }

      // Check if user account is not yet active (before start date)
      if (user.startDate && now < user.startDate) {
        return {
          success: false,
          user: null,
          error: "Account is not yet active",
        };
      }

      // Verify password (plain text comparison for MVP)
      // TODO: Replace with bcrypt.compare() in production
      if (user.passwordHash !== args.password) {
        return {
          success: false,
          user: null,
        };
      }

      // Update lastLogin timestamp
      await ctx.db.patch(user._id, {
        lastLogin: Date.now(),
      });

      // Return user information (excluding password hash)
      return {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          expiryDate: user.expiryDate,
        },
      };
    } catch (error) {
      // Log error for debugging
      console.error("Login error:", error);
      
      // Return failure response
      return {
        success: false,
        user: null,
      };
    }
  },
});
