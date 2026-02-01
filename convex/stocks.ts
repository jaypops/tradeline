import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Stock Management Module
 *
 * Provides functionality for uploading, retrieving, and managing stock data.
 * Stock data includes OHLCV (Open, High, Low, Close, Volume) information.
 */

/**
 * Stock Object Type
 * Represents a single stock's data point
 */
export const stockObject = v.object({
  symbol: v.string(),
  date: v.string(), // Format: MM/DD/YY
  open: v.number(),
  high: v.number(),
  low: v.number(),
  close: v.number(),
  volume: v.number(),
});

/**
 * Upload Stocks Mutation
 *
 * Uploads a new batch of stock data to the database.
 * Creates a new stock_updates record with current timestamp.
 *
 * @param stocks - Array of stock objects with OHLCV data
 * @returns Success status, update ID, and count of stocks uploaded
 */
export const uploadStocks = mutation({
  args: {
    stocks: v.array(stockObject),
  },
  handler: async (ctx, args) => {
    try {
      // Validate stocks array is not empty
      if (!args.stocks || args.stocks.length === 0) {
        return {
          success: false,
          updateId: null,
          stocksCount: 0,
        };
      }

      // Generate current timestamp and publish date
      const now = Date.now();
      const publishDate = new Date().toISOString();

      // Insert new stock update record
      const updateId = await ctx.db.insert("stock_updates", {
        publishDate,
        stocks: args.stocks,
        stocksCount: args.stocks.length,
        createdAt: now,
      });

      // Return success response
      return {
        success: true,
        updateId,
        stocksCount: args.stocks.length,
      };
    } catch (error) {
      // Log error for debugging
      console.error("Upload stocks error:", error);

      // Return failure response
      return {
        success: false,
        updateId: null,
        stocksCount: 0,
      };
    }
  },
});

/**
 * Get Latest Stock Update Query
 *
 * Retrieves the most recent stock update with all stock data.
 * Orders by publishDate in descending order and returns the first result.
 *
 * @returns Latest stock update with complete stocks array, or null if none exist
 */
export const getLatest = query({
  args: {},
  handler: async (ctx) => {
    try {
      // Query stock_updates ordered by publishDate descending
      const latestUpdate = await ctx.db
        .query("stock_updates")
        .order("desc")
        .first();

      // Return null if no updates exist
      if (!latestUpdate) {
        return null;
      }

      // Return the latest update with all stock data
      return {
        id: latestUpdate._id,
        publishDate: latestUpdate.publishDate,
        stocks: latestUpdate.stocks,
        stocksCount: latestUpdate.stocksCount,
        createdAt: latestUpdate.createdAt,
      };
    } catch (error) {
      // Log error for debugging
      console.error("Get latest error:", error);

      // Return null on error
      return null;
    }
  },
});

/**
 * Get Stock Updates History Query
 *
 * Retrieves all stock updates with metadata only (excluding full stocks array).
 * Useful for displaying a list of available updates without loading large data.
 *
 * @returns Array of stock update metadata (id, publishDate, stocksCount, createdAt)
 */
export const getHistory = query({
  args: {},
  handler: async (ctx) => {
    try {
      // Query all stock updates ordered by publishDate descending
      // Query all stock updates ordered by publishDate descending
      const updates = await ctx.db
        .query("stock_updates")
        .order("desc")
        .collect();
      // Map to return only metadata (exclude full stocks array)
      return updates.map((update) => ({
        id: update._id,
        publishDate: update.publishDate,
        stocksCount: update.stocksCount,
        createdAt: update.createdAt,
      }));
    } catch (error) {
      // Log error for debugging
      console.error("Get history error:", error);

      // Return empty array on error
      return [];
    }
  },
});
