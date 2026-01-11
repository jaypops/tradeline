"use client";

import { menuItems } from "@/lib/navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-dvh flex flex-col justify-between">
      <div className="mt-4">
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.slug;

              return (
                <li key={item.title}>
                  <Link
                    href={item.slug}
                    className={clsx(
                      "flex items-center px-2 py-3 rounded-lg transition-colors duration-200",
                      "hover:bg-green-200 hover:border-r-4 hover:border-green-500",
                      isActive && "bg-green-200 border-r-4 border-green-500"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="ml-3 text-sm font-medium">
                      {item.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
