import { StockStore } from "@/lib/priceupdates/store";
import { create } from "zustand";

export const useStockStore = create<StockStore>((set) => ({
  stockData: [],
  errors: [],
  uploadMethod: "paste",
  csvText: "",
  fileName: "",
  setStockData: (stockData) => set({ stockData }),
  setErrors: (errors) => set({ errors }),
  setUploadMethod: (uploadMethod) => set({ uploadMethod }),
  setCsvText: (csvText) => set({ csvText }),
  setFileName: (fileName) => set({ fileName }),
  clearAll: () => set({ stockData: [], errors: [], csvText: "", fileName: "" }),
  updateStock: (id, field, value) =>
    set((state) => ({
      stockData: state.stockData.map((stock) =>
        stock.id === id ? { ...stock, [field]: value } : stock
      ),
    })),
  deleteStock: (id) =>
    set((state) => ({
      stockData: state.stockData.filter((stock) => stock.id !== id),
    })),
}));
