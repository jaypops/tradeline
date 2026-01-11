"use client";

import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useUserStore } from "@/states/useUserStore";
import Dropdown from "./Dropdown";

export default function Filter() {
  const { searchQuery, setSearchQuery } = useUserStore();
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative items-center">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <Dropdown />
      </div>
    </div>
  );
}
