import { useStockStore } from "@/states/useStockStore";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function ActionBtn() {
  const { stockData, errors, clearAll } = useStockStore();

  const handlePublish = () => {
    if (stockData.length === 0) {
      toast.info("No data to publish!");
      return;
    }

    if (errors.length > 0) {
      toast.error("Please fix errors before publishing!");
      return;
    }

    // This would call your Convex mutation
    console.log("Publishing:", stockData);
    toast.success(`Successfully published ${stockData.length} stocks!`);
  };
  return (
    <>
      {stockData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Ready to publish {stockData.length} stocks
            </div>
            <div className="flex gap-3">
              <Button
                onClick={clearAll}
                className="px-6 py-3 border border-gray-300 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePublish}
                disabled={errors.length > 0}
                className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 cursor-pointer ${
                  errors.length > 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                <Upload className="w-4 h-4" />
                Publish Update
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
