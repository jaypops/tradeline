"use client";

import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { useStockStore } from "@/states/useStockStore";
import { parseCSV } from "@/hook/parseCSV";
import { sampleCSV } from "@/lib/priceupdates/store";

export default function Empty() {
  const {
    stockData,
    setCsvText,
    setStockData,
    setUploadMethod,
    setErrors,
    csvText,
  } = useStockStore();

  const loadSample = () => {
    setCsvText(sampleCSV);
    const parsed = parseCSV(sampleCSV, setErrors);
    setStockData(parsed);
    setUploadMethod("paste");
  };
  return (
    <>
      {stockData.length === 0 && !csvText && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Upload className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No data uploaded yet
          </h3>
          <p className="text-gray-600 mb-6">
            Upload or paste your CSV data to get started
          </p>
          <Button
            onClick={loadSample}
            className="px-6 py-2  bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition"
          >
            Load Sample Data
          </Button>
        </div>
      )}
    </>
  );
}
