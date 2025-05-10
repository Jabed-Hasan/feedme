"use client";

import { useEffect, useState } from "react";
import { 
  IconShoppingCart, 
  IconCurrencyDollar, 
  IconCalendar,
  IconReceiptDollar,
  IconPackage
} from "@tabler/icons-react";
import React from "react";

import { ChartCard, DashboardBarChart, DashboardPieChart } from "@/components/dashboard/ChartComponents";
import { getCustomerDashboardStats } from "@/app/services/dashboardService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGetUserOrdersQuery } from "@/redux/features/orders/order";

// Define a type for dashboard data
interface DashboardData {
  totalOrders: number;
  totalSpent: number;
  favoriteProvider: string;
  lastOrderDate: string;
  orderHistory: Array<{month: string, orders: number, amount: number}>;
  orderStatusDistribution: Array<{name: string, value: number}>;
  recentOrders?: Array<{id: string, provider: string, amount: number, status: string, date: string}>;
}

// Mock data for fallback
const mockOrderHistory = [
  { month: "Jan", orders: 3, amount: 250 },
  { month: "Feb", orders: 5, amount: 420 },
  { month: "Mar", orders: 4, amount: 380 },
  { month: "Apr", orders: 6, amount: 520 },
  { month: "May", orders: 5, amount: 450 },
  { month: "Jun", orders: 5, amount: 430 }
];

const mockOrderStatusDistribution = [
  { name: "Pending", value: 2 },
  { name: "Processing", value: 3 },
  { name: "Shipped", value: 1 },
  { name: "Delivered", value: 22 }
];

const mockRecentOrders = [
  { id: "ORD-201", provider: "Tasty Bites", amount: 85, status: "Delivered", date: "2023-06-05" },
  { id: "ORD-202", provider: "Spice Garden", amount: 95, status: "Processing", date: "2023-06-02" },
  { id: "ORD-203", provider: "Home Kitchen", amount: 75, status: "Pending", date: "2023-06-01" },
  { id: "ORD-204", provider: "Tasty Bites", amount: 110, status: "Delivered", date: "2023-05-28" },
  { id: "ORD-205", provider: "Food Express", amount: 65, status: "Delivered", date: "2023-05-25" }
];

export default function CustomerDashboardPage() {
  const user = useAppSelector(currentUser);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch real orders data from API
  const { data: ordersData, isLoading: ordersLoading } = useGetUserOrdersQuery();

  // Create a formatted orders array for the recent orders table
  const formattedOrders = ordersData?.map(order => ({
    id: order._id,
    provider: order.name || "Unknown Provider",
    amount: order.totalPrice || 0,
    status: order.status,
    date: order.createdAt
  })) || [];

  // Calculate order status distribution from real data
  const orderStatusDistribution = React.useMemo(() => {
    if (!ordersData || ordersData.length === 0) {
      return mockOrderStatusDistribution;
    }

    // Count orders by status
    const statusCounts: Record<string, number> = {};
    
    ordersData.forEach(order => {
      const status = order.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Convert to array format needed for pie chart
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }));
  }, [ordersData]);

  // Calculate order history by month from real data
  const orderHistoryData = React.useMemo(() => {
    if (!ordersData || ordersData.length === 0) {
      return mockOrderHistory;
    }

    // Initialize an object to store monthly data
    const monthlyData: Record<string, { orders: number; amount: number }> = {
      'Jan': { orders: 0, amount: 0 },
      'Feb': { orders: 0, amount: 0 },
      'Mar': { orders: 0, amount: 0 },
      'Apr': { orders: 0, amount: 0 },
      'May': { orders: 0, amount: 0 },
      'Jun': { orders: 0, amount: 0 },
      'Jul': { orders: 0, amount: 0 },
      'Aug': { orders: 0, amount: 0 },
      'Sep': { orders: 0, amount: 0 },
      'Oct': { orders: 0, amount: 0 },
      'Nov': { orders: 0, amount: 0 },
      'Dec': { orders: 0, amount: 0 }
    };

    // Group orders by month
    ordersData.forEach(order => {
      if (order.createdAt) {
        const date = new Date(order.createdAt);
        const month = date.toLocaleString('en-US', { month: 'short' });
        
        if (monthlyData[month]) {
          monthlyData[month].orders += 1;
          monthlyData[month].amount += order.totalPrice || 0;
        }
      }
    });

    // Convert to array format needed for bar chart
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      orders: data.orders,
      amount: data.amount
    }));
  }, [ordersData]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const data = await getCustomerDashboardStats();
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-amber-100 text-amber-800';
      case 'shipped':
      case 'paid':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatOrderDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  if (loading || ordersLoading) {
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
    } catch {
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
            Here&apos;s a summary of your food ordering activity.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* Stats Overview */}
      <div className="flex flex-col md:flex-row w-full gap-4 mt-6">
        <div className="flex-1 bg-blue-50 rounded-lg overflow-hidden shadow-sm">
          <div className="p-6 h-full flex flex-col items-center justify-center text-center">
            <div className="mb-2">
              <IconShoppingCart className="h-6 w-6" />
            </div>
            <div className="text-sm text-gray-500 mb-1">Total Orders</div>
            <div className="text-2xl font-bold">
              {formattedOrders.length > 0 ? formattedOrders.length.toString() : dashboardData.totalOrders.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-green-50 rounded-lg overflow-hidden shadow-sm">
          <div className="p-6 h-full flex flex-col items-center justify-center text-center">
            <div className="mb-2">
              <IconCurrencyDollar className="h-6 w-6" />
            </div>
            <div className="text-sm text-gray-500 mb-1">Total Spent</div>
            <div className="text-2xl font-bold">
              {formatCurrency(formattedOrders.length > 0 
                ? formattedOrders.reduce((total, order) => total + order.amount, 0) 
                : dashboardData.totalSpent)}
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-purple-50 rounded-lg overflow-hidden shadow-sm">
          <div className="p-6 h-full flex flex-col items-center justify-center text-center">
            <div className="mb-2">
              <IconCalendar className="h-6 w-6" />
            </div>
            <div className="text-sm text-gray-500 mb-1">Last Order</div>
            <div className="text-2xl font-bold">
              {formattedOrders.length > 0 
                ? formatOrderDate(formattedOrders[0].date) 
                : formatLastOrderDate()}
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-amber-50 rounded-lg overflow-hidden shadow-sm">
          <div className="p-6 h-full flex flex-col items-center justify-center text-center">
            <div className="mb-2">
              <IconReceiptDollar className="h-6 w-6" />
            </div>
            <div className="text-sm text-gray-500 mb-1">Average Order</div>
            <div className="text-2xl font-bold">
              {formatCurrency(formattedOrders.length > 0 
                ? formattedOrders.reduce((total, order) => total + order.amount, 0) / (formattedOrders.length || 1)
                : dashboardData.totalSpent / (dashboardData.totalOrders || 1))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order History Chart */}
        <ChartCard title="Order History" subtitle="Orders by month">
          <DashboardBarChart
            data={orderHistoryData}
            xKey="month"
            yKeys={["orders", "amount"]}
            config={orderHistoryChartConfig}
          />
        </ChartCard>
        
        {/* Order Status Distribution */}
        <ChartCard title="Order Status Distribution">
          <DashboardPieChart data={orderStatusDistribution} />
        </ChartCard>
      </div>
      
      {/* Recent Orders Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <IconPackage className="h-5 w-5" />
            Recent Orders
          </CardTitle>
          <CardDescription>
            Your latest food orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(formattedOrders.length > 0
                ? formattedOrders
                : mockRecentOrders
              ).map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.provider}</TableCell>
                  <TableCell>{formatCurrency(order.amount)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatOrderDate(order.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
