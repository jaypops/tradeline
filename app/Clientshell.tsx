"use client";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { ReactNode } from "react";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <main className="bg-green-200 max-w-full h-dvh">
      <div className="border border-none rounded-[70px] bg-[#FFFFFF] shadow-2xl h-dvh max-w-full px-10 py-5 flex flex-col">
        <Header />
        <div className="flex flex-1 gap-5 mt-5 overflow-hidden">
          <Sidebar />
          <div className="w-px bg-gray-200"></div>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </main>
  );
}
