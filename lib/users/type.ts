export interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
  lastLogin: string;
  downloads: number;
}

export interface UserStore {
  searchQuery: string;
  filterStatus: "all" | "active" | "inactive";
  showAddModal: boolean;
  users: User[];
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: "all" | "active" | "inactive") => void;
  setShowAddModal: (show: boolean) => void;

  toggleUserStatus: (id: number) => void;
  deleteUser: (id: number) => void;
}
