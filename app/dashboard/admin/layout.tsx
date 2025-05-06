"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AdminSidebar from "./components/AdminSidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logAuthStatus } from "@/app/utils/authDebugger";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Set isClient to true when component mounts on client
    setIsClient(true);
    
    // Log authentication status for debugging
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log('Admin Layout - Auth State:', { 
      reduxUser: user?.email,
      reduxToken: token ? `${token.substring(0, 15)}...` : 'No token',
      localStorageToken: storedToken ? `${storedToken.substring(0, 15)}...` : 'No token'
    });
    
    if (typeof window !== 'undefined') {
      // Debug token info
      logAuthStatus();
    }

    // Check if we need to refresh the authentication state from localStorage
    if (!token && storedToken && !user) {
      console.log('Token found in localStorage but not in Redux state. You may need to refresh the page.');
    }

    // Redirect if not logged in or not an admin
    if (!token && !storedToken) {
      console.log('No authentication token found, redirecting to login');
      router.push("/login");
    } else if (user && user.role !== "admin") {
      console.log('User is not an admin, redirecting based on role:', user.role);
      // Redirect to appropriate dashboard based on role
      if (user.role === "provider") {
        router.push("/dashboard/provider");
      } else {
        router.push("/dashboard/customer");
      }
    }
    
    setAuthChecked(true);
  }, [user, router, token]);

  // Return the same sidebar structure for both server and initial client render
  // but only show the content when authenticated on the client
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="bg-muted/40 flex h-14 items-center gap-4 border-b px-6 lg:h-[60px]">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {isClient && (!authChecked || !user || user.role !== "admin") ? (
            <div className="flex h-48 items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
                <p>Verifying authentication...</p>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
