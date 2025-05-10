"use client";

import React from "react";
import { 
  IconShoppingCart, 
  IconChefHat, 
  IconCurrencyDollar, 
  IconUsers 
} from "@tabler/icons-react";
import { StatCard, StatCardGrid } from "@/components/dashboard/DashboardCards";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { getRealAdminDashboardStats } from "@/app/services/dashboardService";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStats() {
  const { data: userData, isLoading: isUserDataLoading } = useGetAllUsersQuery();
  const [statsData, setStatsData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function generateStats() {
      if (userData && userData.length > 0) {
        const data = await getRealAdminDashboardStats(userData);
        setStatsData(data);
        setLoading(false);
      }
    }

    if (!isUserDataLoading && userData) {
      generateStats();
    }
  }, [userData, isUserDataLoading]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-lg bg-gray-50">
            <Skeleton className="h-6 w-[100px] mb-3" />
            <Skeleton className="h-10 w-[150px]" />
          </div>
        ))}
      </div>
    );
  }

  if (!statsData) {
    return (
      <div className="text-center text-gray-500">
        Failed to load dashboard statistics.
      </div>
    );
  }

  return (
    <StatCardGrid>
      <StatCard
        title="Total Users"
        value={statsData.totalUsers.toLocaleString()}
        icon={<IconUsers className="h-6 w-6" />}
        className="bg-blue-50"
      />
      <StatCard
        title="Total Providers"
        value={statsData.totalProviders.toLocaleString()}
        icon={<IconChefHat className="h-6 w-6" />}
        className="bg-green-50"
      />
      <StatCard
        title="Total Orders"
        value={statsData.totalOrders.toLocaleString()}
        icon={<IconShoppingCart className="h-6 w-6" />}
        className="bg-yellow-50"
      />
      <StatCard
        title="Total Revenue"
        value={formatCurrency(statsData.totalRevenue)}
        icon={<IconCurrencyDollar className="h-6 w-6" />}
        className="bg-purple-50"
      />
    </StatCardGrid>
  );
} 