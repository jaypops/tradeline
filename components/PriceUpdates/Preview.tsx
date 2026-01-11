"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableHeaderList } from "@/lib/priceupdates/TableHeaderList";
import { useStockStore } from "@/states/useStockStore";
import { Button } from "../ui/button";
import { Check, Edit2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { StockData } from "@/lib/priceupdates/store";
import ActionBtn from "./ActionBtn";

export default function Preview() {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    stockData,
    setCsvText,
    setStockData,
    setErrors,
    setFileName,
    errors,
  } = useStockStore();
  const clearAll = () => {
    setCsvText("");
    setStockData([]);
    setErrors([]);
    setFileName("");
    setEditingIndex(null);
  };

  const handleEdit = <K extends keyof StockData>(
    index: number,
    field: K,
    value: StockData[K]
  ) => {
    const updated = [...stockData];
    updated[index] = {
      ...updated[index],
      [field]: field === "symbol" || field === "date" ? value : Number(value),
    };
    setStockData(updated);
  };

  const handleDelete = (id: number | string) => {
    setStockData(stockData.filter((stock) => stock.id !== id));
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
              <p className="text-sm text-gray-600 mt-1">
                {stockData.length} stocks •{" "}
                {errors.length > 0 ? `${errors.length} errors` : "No errors"}
              </p>
            </div>
            <Button
              onClick={clearAll}
              className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-500 cursor-pointer rounded-lg transition flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto ">
        <Table>
          <TableHeader>
            <TableRow>
              {TableHeaderList.map((header, index) => (
                <TableHead
                  key={index}
                  className={`px-6 py-3 text-${header.align} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                >
                  {header.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {stockData.map((stock, index) => (
              <TableRow key={stock.id} className="hover:bg-gray-50">
                {/* SYMBOL */}
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {editingIndex === index ? (
                    <Input
                      type="text"
                      value={stock.symbol}
                      onChange={(e) =>
                        handleEdit(index, "symbol", e.target.value)
                      }
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <span className="font-medium text-gray-900">
                      {stock.symbol}
                    </span>
                  )}
                </TableCell>

                {/* DATE */}
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {editingIndex === index ? (
                    <Input
                      type="text"
                      value={stock.date}
                      onChange={(e) =>
                        handleEdit(index, "date", e.target.value)
                      }
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    stock.date
                  )}
                </TableCell>

                {/* OPEN */}
                <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {editingIndex === index ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={stock.open}
                      onChange={(e) =>
                        handleEdit(index, "open", parseFloat(e.target.value))
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                    />
                  ) : (
                    stock.open.toFixed(2)
                  )}
                </TableCell>

                {/* HIGH */}
                <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {editingIndex === index ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={stock.high}
                      onChange={(e) =>
                        handleEdit(index, "high", parseFloat(e.target.value))
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                    />
                  ) : (
                    stock.high.toFixed(2)
                  )}
                </TableCell>

                {/* LOW */}
                <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {editingIndex === index ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={stock.low}
                      onChange={(e) =>
                        handleEdit(index, "low", parseFloat(e.target.value))
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                    />
                  ) : (
                    stock.low.toFixed(2)
                  )}
                </TableCell>

                {/* CLOSE */}
                <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {editingIndex === index ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={stock.close}
                      onChange={(e) =>
                        handleEdit(index, "close", parseFloat(e.target.value))
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                    />
                  ) : (
                    stock.close.toFixed(2)
                  )}
                </TableCell>

                {/* VOLUME */}
                <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {editingIndex === index ? (
                    <Input
                      type="number"
                      value={stock.volume}
                      onChange={(e) =>
                        handleEdit(index, "volume", parseFloat(e.target.value))
                      }
                      className="w-28 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                    />
                  ) : (
                    stock.volume.toLocaleString()
                  )}
                </TableCell>

                {/* ACTIONS */}
                <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-2">
                    {editingIndex === index ? (
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(stock.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ActionBtn />
    </>
  );
}
