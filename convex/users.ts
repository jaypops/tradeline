import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * User Management Module
 * 
 * Provides functionality for creating and managing user accounts.
 * For MVP, passwords are stored as plain text.
 * TODO: Add bcrypt hashing for production use.
 */

/**
 * Create User Mutation
 * 
 * Creates a new user account with the provided credentials.
 * The account is automatically set to active status.
 * 
 * @param name - User's full name
 * @param email - User's email address (should be unique)
 * @param password - User's password (plain text for MVP)
 * @returns Success status and the new user's ID
 */
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    startDate: v.optional(v.number()),
    expiryDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      // Check if user with this email already exists
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      if (existingUser) {
        // Email already in use
        return {
          success: false,
          userId: null,
        };
      }

      // Generate current timestamp
      const now = Date.now();

      // Insert new user with active status
      const userId = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        // Store password as plain text for MVP
        // TODO: Add bcrypt hashing in production:
        // const salt = await bcrypt.genSalt(10);
        // const passwordHash = await bcrypt.hash(args.password, salt);
        passwordHash: args.password,
        isActive: true,
        lastLogin: now,
        createdAt: now,
        startDate: args.startDate,
        expiryDate: args.expiryDate,
      });

      // Return success response
      return {
        success: true,
        userId,
      };
    } catch (error) {
      // Log error for debugging
      console.error("Create user error:", error);
      
      // Return failure response
      return {
        success: false,
        userId: null,
      };
    }
  },
});

/**
 * List Users Query
 * 
 * Retrieves all users from the database.
 * Excludes the passwordHash field for security.
 * 
 * @returns Array of users without password information
 */
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    try {
      // Query all users
      const users = await ctx.db.query("users").collect();

      // Map to return users without password hash
      return users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      }));
    } catch (error) {
      // Log error for debugging
      console.error("List users error:", error);
      
      // Return empty array on error
      return [];
    }
  },
});
