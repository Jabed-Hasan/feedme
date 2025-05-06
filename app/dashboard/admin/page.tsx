"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const { isChecking, isAuthenticated, redirectToLogin } = useAdminAuth();

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3">Checking authorization...</span>
      </div>
    );
  }

  // Authentication prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
        
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
              <p className="text-gray-500">Please log in with admin credentials to access the dashboard.</p>
            </div>
            
            <Button onClick={redirectToLogin} className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Users</div>
            <p className="text-muted-foreground text-xs">
              Manage users, roles and permissions
            </p>
            <button
              onClick={() => router.push("/dashboard/admin/manage-users")}
              className="bg-primary mt-4 rounded-md px-4 py-2 text-sm text-white"
            >
              Manage Users
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter</CardTitle>
            <Mail className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Subscribers</div>
            <p className="text-muted-foreground text-xs">
              View all newsletter subscribers
            </p>
            <button
              onClick={() => router.push("/dashboard/admin/newsletter-subscribers")}
              className="bg-primary mt-4 rounded-md px-4 py-2 text-sm text-white"
            >
              View Subscribers
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
