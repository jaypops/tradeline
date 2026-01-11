import Empty from "@/components/PriceUpdates/Empty";
import LoadSample from "@/components/PriceUpdates/LoadSample";
import Preview from "@/components/PriceUpdates/Preview";
import SwitchCSV from "@/components/PriceUpdates/SwitchCSV";

export default function PriceUpdatePage() {
  return (
    <main>
      <div className="flex flex-row items-center justify-between mt-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Upload Stock Data</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Upload daily stock prices for distribution
          </p>
        </div>
        <div>
          <LoadSample />
        </div>
      </div>
      <SwitchCSV />
      <Preview />
      <Empty />
    </main>
  );
}
