import { UserStore, User } from "@/lib/users/type";
import { usersDetails } from "@/lib/users/usersDetails";
import { create } from "zustand";

export const useUserStore = create<UserStore>((set, get) => ({
  searchQuery: "",
  filterStatus: "all",
  showAddModal: false,
  users: usersDetails,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setShowAddModal: (show) => set({ showAddModal: show }),
  setUsers: (users: User[]) => set({ users }),
  toggleUserStatus: (id) =>
    set({
      users: get().users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      ),
    }),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
}));
