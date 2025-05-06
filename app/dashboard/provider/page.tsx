"use client";

import { useEffect, useState } from "react";
import { 
  IconChefHat, 
  IconShoppingCart, 
  IconCurrencyDollar, 
  IconStar 
} from "@tabler/icons-react";
import { format } from "date-fns";

import { StatCard, StatCardGrid } from "@/components/dashboard/DashboardCards";
import { ChartCard, DashboardAreaChart, DashboardPieChart } from "@/components/dashboard/ChartComponents";
import { getProviderDashboardStats } from "@/app/services/dashboardService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { Skeleton } from "@/components/ui/skeleton";

// Define a type for dashboard data
interface DashboardData {
  totalMeals: number;
  activeMeals: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  orderStatusDistribution: Array<{name: string, value: number}>;
  revenueOverTime: Array<{date: string, revenue: number}>;
}

export default function ProviderDashboardPage() {
  const user = useAppSelector(currentUser);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        // Don't check for user ID, just pass a placeholder value or empty string
        const data = await getProviderDashboardStats(user?.id || "provider-1");
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    // Remove user ID dependency, always fetch data
    fetchDashboardData();
  }, [user?.id]); // Add user?.id as dependency

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Chart configs
  const revenueChartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))",
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Card */}
      <Card className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome back, {user?.name || 'Provider'}!</CardTitle>
          <CardDescription>
            Here&apos;s an overview of your restaurant performance.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* Stats Overview */}
      <StatCardGrid>
        <StatCard
          title="Total Meals"
          value={dashboardData.totalMeals}
          icon={<IconChefHat className="h-6 w-6" />}
          className="bg-green-50"
        />
        <StatCard
          title="Active Meals"
          value={dashboardData.activeMeals}
          description={`${((dashboardData.activeMeals / dashboardData.totalMeals) * 100).toFixed(0)}% of total`}
          icon={<IconChefHat className="h-6 w-6" />}
          className="bg-blue-50"
        />
        <StatCard
          title="Total Orders"
          value={dashboardData.totalOrders.toLocaleString()}
          icon={<IconShoppingCart className="h-6 w-6" />}
          className="bg-yellow-50"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboardData.totalRevenue)}
          icon={<IconCurrencyDollar className="h-6 w-6" />}
          className="bg-purple-50"
        />
      </StatCardGrid>
      
      {/* Second Row of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard
          title="Average Rating"
          value={dashboardData.averageRating}
          icon={<IconStar className="h-6 w-6 text-yellow-500" />}
          className="bg-amber-50 col-span-1"
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <ChartCard title="Revenue Trend" subtitle="Last 7 days">
          <DashboardAreaChart
            data={dashboardData.revenueOverTime.map((item) => ({
              date: format(new Date(item.date), 'MMM dd'),
              revenue: item.revenue,
            }))}
            xKey="date"
            yKeys={["revenue"]}
            config={revenueChartConfig}
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
