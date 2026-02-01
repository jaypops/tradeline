import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database Schema for Stock Data Distribution System
 * 
 * This schema defines three main tables:
 * 1. users - User accounts for authentication
 * 2. stock_updates - Stock data uploads with historical records
 * 3. download_logs - Optional tracking of download activities (MVP)
 */

export default defineSchema({
  /**
   * Users Table
   * Stores user account information for authentication
   */
  users: defineTable({
    // User's full name
    name: v.string(),
    
    // Unique email address for login
    email: v.string(),
    
    // Password hash (plain text for MVP - add bcrypt hashing in production)
    passwordHash: v.string(),
    
    // Account active status
    isActive: v.boolean(),
    
    // Timestamp of last successful login (ms since epoch)
    lastLogin: v.number(),
    
    // Timestamp when user was created (ms since epoch)
    createdAt: v.number(),
    
    // Start date for user access (ms since epoch)
    startDate: v.optional(v.number()),
    
    // Expiry date for user access (ms since epoch)
    expiryDate: v.optional(v.number()),
  })
    // Index for fast email lookup during login
    .index("by_email", ["email"])
    // Index for listing active users
    .index("by_active", ["isActive"]),

  /**
   * Stock Updates Table
   * Stores stock data uploads with metadata
   */
  stock_updates: defineTable({
    // ISO date string when the stock data was published
    publishDate: v.string(),
    
    // Array of stock objects with OHLCV data
    stocks: v.array(
      v.object({
        symbol: v.string(),
        date: v.string(),    // Format: MM/DD/YY
        open: v.number(),
        high: v.number(),
        low: v.number(),
        close: v.number(),
        volume: v.number(),
      })
    ),
    
    // Count of stocks in the array for quick reference
    stocksCount: v.number(),
    
    // Timestamp when this update was created (ms since epoch)
    createdAt: v.number(),
  })
    // Index for retrieving latest updates
    .index("by_publish_date", ["publishDate"])
    // Index for chronological ordering
    .index("by_created_at", ["createdAt"]),

  /**
   * Download Logs Table (Optional for MVP)
   * Tracks download activities for analytics
   */
  shareable_links: defineTable({
    // Unique token for the shareable link
    token: v.string(),
    
    // Start date for the link (ms since epoch)
    startDate: v.number(),
    
    // Expiry date for the link (ms since epoch)
    expiryDate: v.number(),
    
    // Whether the link has been used
    isUsed: v.boolean(),
    
    // Reference to the user created from this link
    userId: v.optional(v.id("users")),
    
    // Timestamp when link was created (ms since epoch)
    createdAt: v.number(),
  })
    // Index for fast token lookup
    .index("by_token", ["token"])
    // Index for checking expired links
    .index("by_expiry", ["expiryDate"]),

  download_logs: defineTable({
    // Reference to the user who downloaded
    userId: v.id("users"),
    
    // Reference to the stock update that was downloaded
    updateId: v.id("stock_updates"),
    
    // Timestamp when download occurred (ms since epoch)
    downloadedAt: v.number(),
    
    // Whether the download was successful
    success: v.boolean(),
  })
    // Index for querying user's download history
    .index("by_user", ["userId"])
    // Index for querying update's download history
    .index("by_update", ["updateId"]),
});
