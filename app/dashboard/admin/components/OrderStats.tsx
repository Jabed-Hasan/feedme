"use client";

import React from "react";
import { ChartCard, DashboardPieChart } from "@/components/dashboard/ChartComponents";
import { DashboardTable } from "@/components/dashboard/DashboardTable";

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";

interface Order {
  _id: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

interface TableCellProps {
  row: {
    original: {
      amount: number;
      status: OrderStatus;
    };
  };
}

export function OrderStats() {
  // Generate mock order data
  const generateMockOrders = (): Order[] => {
    const statuses: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered"];
    const customers = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown", "Charlie Davis", 
                      "Eva Wilson", "Michael Clark", "Sophia Lee", "Daniel Kim", "Olivia Taylor"];
    const orders: Order[] = [];
    
    // Generate 50 mock orders
    for (let i = 1; i <= 50; i++) {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const randomAmount = Math.floor(Math.random() * 200) + 50; // $50 to $250
      
      // Generate date within last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      orders.push({
        _id: `ORD-${String(i).padStart(3, '0')}`,
        customer: randomCustomer,
        amount: randomAmount,
        status: randomStatus,
        date: date.toISOString().split('T')[0],
      });
    }
    
    return orders;
  };
  
  // Get order status distribution
  const getOrderStatusDistribution = (orders: Order[]) => {
    const distribution = [
      { name: "Pending", value: 0 },
      { name: "Processing", value: 0 },
      { name: "Shipped", value: 0 },
      { name: "Delivered", value: 0 }
    ];
    
    orders.forEach(order => {
      const statusIndex = distribution.findIndex(item => item.name === order.status);
      if (statusIndex !== -1) {
        distribution[statusIndex].value += 1;
      }
    });
    
    return distribution;
  };
  
  // Generate orders once
  const allOrders = generateMockOrders();
  
  // Get recent orders (sorted by date)
  const recentOrders = [...allOrders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Table columns for recent orders
  const orderColumns = [
    {
      accessorKey: "_id",
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
  
  // Get order status distribution
  const orderStatusDistribution = getOrderStatusDistribution(allOrders);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Order Status Distribution" subtitle="Current status of all orders">
        <DashboardPieChart data={orderStatusDistribution} />
      </ChartCard>
      
      <DashboardTable
        title="Recent Orders"
        subtitle="Latest customer orders"
        columns={orderColumns}
        data={recentOrders}
        searchField="customer"
      />
    </div>
  );
} 