import { stockSchema } from "@/lib/priceupdates/schemas"
import type { StockData } from "@/lib/priceupdates/store"

export function parseCSV(
  text: string,
  setErrors: (e: { line: number; message: string }[]) => void,
) {
  const lines = text.trim().split("\n")
  const parsed: StockData[] = []
  const errors: { line: number; message: string }[] = []

  lines.forEach((line, index) => {
    const parts = line.split(",").map((p) => p.trim())

    if (parts.length !== 7) {
      errors.push({ line: index + 1, message: "Invalid column count" })
      return
    }

    const result = stockSchema.safeParse({
      symbol: parts[0],
      date: parts[1],
      open: parts[2],
      high: parts[3],
      low: parts[4],
      close: parts[5],
      volume: parts[6],
    })

    if (!result.success) {
      errors.push({
        line: index + 1,
        message: result.error.issues[0].message,
      })
    } else {
      parsed.push({
        id: `${Date.now()}-${index}`,
        ...result.data,
      })
    }
  })

  setErrors(errors)
  return parsed
}
