import { MdSpaceDashboard, MdAccountCircle } from "react-icons/md";
import { IoMdPricetags } from "react-icons/io";
import { FaUser } from "react-icons/fa";

export const menuItems = [
  {
    title: "Dashboard",
    slug: "/dashboard",
    icon: MdSpaceDashboard,
  },
  {
    title: "Price Updates",
    slug: "/price-updates",
    icon: IoMdPricetags,
  },
  {
    title: "Account Management",
    slug: "/account-management",
    icon: MdAccountCircle,
  },
  {
    title: "Users",
    slug: "/users",
    icon: FaUser,
  },
];
