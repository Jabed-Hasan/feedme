"use client";

import UserManagementTable from "@/components/userManagement";
import { DashboardStats } from "../components/DashboardStats";
import { OrderStats } from "../components/OrderStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ManageUsers() {
  return (
    <div className="space-y-6">
      <Card className="rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Manage Users</CardTitle>
          <CardDescription>
            View and manage all users of your food delivery platform.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* Real-time Dashboard Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Platform Statistics</h2>
        <DashboardStats />
      </div>
      
      {/* Order Statistics */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Order Statistics</h2>
        <OrderStats />
      </div>
      
      {/* User Management Table */}
      <UserManagementTable />
    </div>
  );
}
