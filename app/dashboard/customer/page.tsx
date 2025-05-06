"use client";

import { useEffect, useState } from "react";
import { 
  IconShoppingCart, 
  IconCurrencyDollar, 
  IconHeart, 
  IconCalendar
} from "@tabler/icons-react";

import { StatCard, StatCardGrid } from "@/components/dashboard/DashboardCards";
import { ChartCard, DashboardBarChart, DashboardPieChart } from "@/components/dashboard/ChartComponents";
import { getCustomerDashboardStats } from "@/app/services/dashboardService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function CustomerDashboardPage() {
  const user = useAppSelector(currentUser);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        // Don't check for user ID, just pass a placeholder value
        const data = await getCustomerDashboardStats(user?._id || "customer-1");
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    // Remove user ID dependency, always fetch data
    fetchDashboardData();
  }, []); // Remove user?._id dependency

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Chart configs
  const orderHistoryChartConfig = {
    orders: {
      label: "Orders",
      color: "hsl(var(--primary))",
    },
    amount: {
      label: "Amount Spent",
      color: "hsl(var(--secondary))",
    }
  };

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

  const formatLastOrderDate = () => {
    try {
      const date = new Date(dashboardData.lastOrderDate);
      return format(date, 'MMM dd, yyyy');
    } catch (e) {
      return dashboardData.lastOrderDate;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Card */}
      <Card className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome back, {user?.name || 'Customer'}!</CardTitle>
          <CardDescription>
            Here's a summary of your food ordering activity.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* Stats Overview */}
      <StatCardGrid>
        <StatCard
          title="Total Orders"
          value={dashboardData.totalOrders.toLocaleString()}
          icon={<IconShoppingCart className="h-6 w-6" />}
          className="bg-blue-50"
        />
        <StatCard
          title="Total Spent"
          value={formatCurrency(dashboardData.totalSpent)}
          icon={<IconCurrencyDollar className="h-6 w-6" />}
          className="bg-green-50"
        />
        <StatCard
          title="Favorite Provider"
          value={dashboardData.favoriteProvider}
          icon={<IconHeart className="h-6 w-6 text-red-500" />}
          className="bg-red-50"
        />
        <StatCard
          title="Last Order"
          value={formatLastOrderDate()}
          icon={<IconCalendar className="h-6 w-6" />}
          className="bg-purple-50"
        />
      </StatCardGrid>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order History Chart */}
        <ChartCard title="Order History" subtitle="Orders by month">
          <DashboardBarChart
            data={dashboardData.orderHistory}
            xKey="month"
            yKeys={["orders", "amount"]}
            config={orderHistoryChartConfig}
          />
        </ChartCard>
        
        {/* Order Status Distribution */}
        <ChartCard title="Order Status Distribution">
          <DashboardPieChart data={dashboardData.orderStatusDistribution} />
        </ChartCard>
      </div>
    </div>
  );
}
