"use client";
import {
  Package2,
  Users,
  LogOut,
  LayoutDashboard,
  User,
  Home,
  Mail,
  BookText,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const adminMenuItems = [
  { name: "Home", path: "/", icon: <Home /> },
  { name: "Dashboard", path: "/dashboard/admin", icon: <LayoutDashboard /> },
  {
    name: "Manage Users",
    path: "/dashboard/admin/manage-users",
    icon: <Users />,
  },
  {
    name: "Newsletter",
    path: "/dashboard/admin/newsletter-subscribers",
    icon: <Mail />,
  },
  { name: "Manage Blogs", path: "/dashboard/admin/blogs", icon: <BookText /> },
  { name: "Profile", path: "/dashboard/admin/profile", icon: <User /> },
];

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    router.push("/login");
    toast.success("Logged out successfully");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-[60px] items-center px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Feedme - Admin</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {adminMenuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild size={"lg"} key={index}>
                <Link
                  href={item.path}
                  key={index}
                  className="flex items-center gap-2 rounded-md p-2 text-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <span className="text-gray-500">{item.icon}</span>
                  <span className="font-bold">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-500 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-bold">Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
