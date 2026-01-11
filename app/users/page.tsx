"use client";

import { Button } from "@/components/ui/button";
import Filter from "@/components/users/Filters";
import UserTable from "@/components/users/UserTable";
import { useUserStore } from "@/states/useUserStore";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const { users, setShowAddModal } = useUserStore();
  const activeCount = users.filter((user) => user.status === "active").length;
  const inactiveCount = users.filter(
    (user) => user.status === "inactive"
  ).length;

  const router = useRouter();
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-gray-600 mt-1 text-sm">
              {activeCount} active • {inactiveCount} inactive • {users.length}{" "}
              total
            </p>
          </div>
          <Button
            onClick={() => {
              setShowAddModal(true);
              router.push("/users/add-user");
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>
      <Filter />
      <UserTable />
    </>
  );
}
