export interface StockData {
  id: string;
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ValidationError {
  line: number;
  message: string;
}

export interface StockStore {
  stockData: StockData[];
  errors: ValidationError[];
  uploadMethod: "paste" | "file";
  csvText: string;
  fileName: string;
  setStockData: (data: StockData[]) => void;
  setErrors: (errors: ValidationError[]) => void;
  setUploadMethod: (method: "paste" | "file") => void;
  setCsvText: (text: string) => void;
  setFileName: (name: string) => void;
  clearAll: () => void;
  updateStock: (
    id: string,
    field: keyof StockData,
    value: string | number
  ) => void;
  deleteStock: (id: string) => void;
}

export const sampleCSV = `ABBEYBDS,12/29/25,5.85,5.85,5.85,5.85,192953
ZENITHBANK,12/29/25,35.20,36.50,35.00,36.20,1500000
ACCESS,12/29/25,18.50,19.00,18.30,18.85,980000`;
