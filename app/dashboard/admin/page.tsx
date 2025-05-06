"use client";

import { useEffect, useState } from "react";
import { 
  IconShoppingCart, 
  IconChefHat, 
  IconCurrencyDollar, 
  IconUsers 
} from "@tabler/icons-react";
import { format } from "date-fns";

import { StatCard, StatCardGrid } from "@/components/dashboard/DashboardCards";
import { ChartCard, DashboardAreaChart, DashboardBarChart, DashboardPieChart } from "@/components/dashboard/ChartComponents";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { getAdminDashboardStats } from "@/app/services/dashboardService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { Skeleton } from "@/components/ui/skeleton";

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

// Define type for table cell
interface TableCellProps {
  row: {
    original: {
      amount: number;
      status: OrderStatus;
    };
  };
}

export default function AdminDashboardPage() {
  const user = useAppSelector(currentUser);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const data = await getAdminDashboardStats();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

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

  const usersChartConfig = {
    count: {
      label: "New Users",
      color: "hsl(var(--primary))",
    }
  };

  // Table columns for recent orders
  const orderColumns = [
    {
      accessorKey: "id",
      header: "Order ID",
    },
    {
      accessorKey: "customer",
      header: "Customer",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: TableCellProps) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: TableCellProps) => {
        const status = row.original.status;
        let color = "bg-gray-100 text-gray-800";
        
        if (status === "Delivered") color = "bg-green-100 text-green-800";
        else if (status === "Processing") color = "bg-blue-100 text-blue-800";
        else if (status === "Shipped") color = "bg-purple-100 text-purple-800";
        else if (status === "Pending") color = "bg-yellow-100 text-yellow-800";
        
        return (
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
    },
  ];

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
      <StatCardGrid>
        <StatCard
          title="Total Users"
          value={dashboardData.totalUsers.toLocaleString()}
          icon={<IconUsers className="h-6 w-6" />}
          className="bg-blue-50"
        />
        <StatCard
          title="Total Providers"
          value={dashboardData.totalProviders.toLocaleString()}
          icon={<IconChefHat className="h-6 w-6" />}
          className="bg-green-50"
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
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <ChartCard title="Revenue Trend" subtitle="Last 6 months">
          <DashboardBarChart
            data={dashboardData.revenueOverTime}
            xKey="month"
            yKeys={["revenue"]}
            config={revenueChartConfig}
          />
        </ChartCard>
        
        {/* New Users Chart */}
        <ChartCard title="New Users" subtitle="Last 7 days">
          <DashboardAreaChart
            data={dashboardData.newUsersOverTime.map((item) => ({
              date: format(new Date(item.date), 'MMM dd'),
              count: item.count,
            }))}
            xKey="date"
            yKeys={["count"]}
            config={usersChartConfig}
          />
        </ChartCard>
      </div>
      
      {/* Order Status Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Order Status Distribution" subtitle="Current status of all orders">
          <DashboardPieChart data={dashboardData.orderStatusDistribution} />
        </ChartCard>
        
        {/* Recent Orders Table */}
        <DashboardTable
          title="Recent Orders"
          subtitle="Latest transactions across the platform"
          columns={orderColumns}
          data={dashboardData.recentOrders}
        />
      </div>
    </div>
  );
}
