"use client";

import { useStockStore } from "@/states/useStockStore";
import { Button } from "../ui/button";
import { parseCSV } from "@/hook/parseCSV";
import { sampleCSV } from "@/lib/priceupdates/store";

export default function LoadSample() {
  const { setCsvText, setStockData, setUploadMethod, setErrors } =
    useStockStore();

  const loadSample = () => {
    setCsvText(sampleCSV);
    const parsed = parseCSV(sampleCSV, setErrors);
    setStockData(parsed);
    setUploadMethod("paste");
  };
  return (
    <Button
      onClick={loadSample}
      className="px-4 py-2 text-sm text-green-500 rounded-lg bg-transition hover:bg-transparent cursor-pointer"
    >
      Load Sample Data
    </Button>
  );
}
