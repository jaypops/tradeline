import { z } from "zod"

export const stockSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  date: z.string().min(1, "Date is required"),
  open: z.coerce.number().positive("Open must be positive"),
  high: z.coerce.number().positive("High must be positive"),
  low: z.coerce.number().positive("Low must be positive"),
  close: z.coerce.number().positive("Close must be positive"),
  volume: z.coerce.number().int().nonnegative("Volume must be non-negative"),
})

export type StockInput = z.infer<typeof stockSchema>
