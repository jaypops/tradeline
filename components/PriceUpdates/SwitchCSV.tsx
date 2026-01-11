"use client";

import { useStockStore } from "@/states/useStockStore";
import { parseCSV } from "@/hook/parseCSV";
import { Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export default function SwitchCSV() {
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const {
    uploadMethod,
    csvText,
    setStockData,
    setErrors,
    setUploadMethod,
    setCsvText,
  } = useStockStore();

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCsvText(text);

    if (text.trim()) {
      const parsed = parseCSV(text, setErrors);
      setStockData(parsed);
    } else {
      setStockData([]);
      setErrors([]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      const text = reader.result;
      setCsvText(text);

      const parsed = parseCSV(text, setErrors);
      setStockData(parsed);
    };

    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm pt-6 mb-6">
      <div className="flex gap-4 mb-6 max-w-46 w-full">
        <Button
          onClick={() => setUploadMethod("paste")}
          className={`flex-1 py-3 rounded-lg font-medium transition cursor-pointer  text-sm ${
            uploadMethod === "paste"
              ? "bg-green-600 text-white hover:bg-green-700 transition"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Paste CSV Data
        </Button>
        <Button
          onClick={() => setUploadMethod("file")}
          className={`flex-1 py-3 rounded-lg font-medium transition cursor-pointer text-sm ${
            uploadMethod === "file"
              ? "bg-green-600 text-white hover:bg-green-700 transition"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Upload CSV File
        </Button>
      </div>

      {uploadMethod === "paste" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste CSV Data
            <span className="text-gray-500 font-normal ml-2 text-sm">
              (Format: SYMBOL,DATE,OPEN,HIGH,LOW,CLOSE,VOLUME)
            </span>
          </label>
          <textarea
            value={csvText}
            onChange={handlePaste}
            placeholder="ABBEYBDS,12/29/25,5.85,5.85,5.85,5.85,192953&#10;ZENITHBANK,12/29/25,35.20,36.50,35.00,36.20,1500000"
            className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {uploadMethod === "file" && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />

          {fileName ? (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900">{fileName}</p>
              <p className="text-xs text-gray-500 mt-1">
                File uploaded successfully
              </p>
            </div>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your CSV file here
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
            </>
          )}

          <label className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden"
            />
            Browse Files
          </label>
        </div>
      )}
    </div>
  );
}
