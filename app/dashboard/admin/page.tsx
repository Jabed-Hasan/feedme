"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

import { ChartCard, DashboardAreaChart, DashboardBarChart } from "@/components/dashboard/ChartComponents";
import { getAdminDashboardStats } from "@/app/services/dashboardService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { DashboardStats } from "./components/DashboardStats";
import { OrderStats } from "./components/OrderStats";
import { DynamicCharts } from "./components/DynamicCharts";

// Define order status type
type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";

// Define types for dashboard data
interface DashboardData {
  totalUsers: number;
  totalProviders: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  orderStatusDistribution: Array<{name: string, value: number}>;
  newUsersOverTime: Array<{date: string, count: number}>;
  revenueOverTime: Array<{month: string, revenue: number}>;
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    status: OrderStatus;
    date: string;
  }>;
}

export default function AdminDashboardPage() {
  const user = useAppSelector(currentUser);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch user data from API
  const { data: userData, isLoading: isUserDataLoading } = useGetAllUsersQuery();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Only fall back to mock data if no user data available
        if (userData && userData.length > 0) {
          // Use only user data, don't rely on order data from API
          const data = await getAdminDashboardStats();
          setDashboardData(data);
        } else {
          const data = await getAdminDashboardStats();
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch dashboard data when user data is available or loading is complete
    if (!isUserDataLoading) {
      fetchDashboardData();
    }
  }, [userData, isUserDataLoading]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="rounded-xl shadow mb-6">
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-[100px] mb-3" />
                <Skeleton className="h-10 w-[150px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-gray-500">Failed to load dashboard data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Card */}
      <Card className="rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome back, {user?.name || 'Admin'}!</CardTitle>
          <CardDescription>
            Here&apos;s what&apos;s happening with your food delivery platform today.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* Stats Overview */}
      <DashboardStats />
      
      {/* Dynamic Charts Section */}
      <DynamicCharts />
      
      {/* Order Status & Recent Orders */}
      <OrderStats />
    </div>
  );
}
