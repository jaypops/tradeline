import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/states/useUserStore";

export default function Dropdown() {
  const { setFilterStatus } = useUserStore();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100 transition">
          Users &#x25BC;
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setFilterStatus("all")}>
            All Users
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setFilterStatus("active")}>
            Active Only
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setFilterStatus("inactive")}>
            Inactive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
