"use client";

import axios from "axios";
import { baseApiUrl } from "@/app/utils/baseUrl";

// Toggle to use mock data during development
const USE_MOCK_DATA = true;

// Admin Dashboard Data
export async function getAdminDashboardStats() {
  // Always return mock data if USE_MOCK_DATA is true
  if (USE_MOCK_DATA) {
    return getMockAdminStats();
  }
  
  try {
    const response = await axios.get(`${baseApiUrl}/dashboard/admin/stats`);
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    // Return mock data as fallback
    return getMockAdminStats();
  }
}

// Provider Dashboard Data
export async function getProviderDashboardStats() {
  // Always return mock data if USE_MOCK_DATA is true
  if (USE_MOCK_DATA) {
    return getMockProviderStats();
  }

  // Get token from Redux or localStorage
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  try {
    const response = await axios.get(`${baseApiUrl}/user/provider/dashboard-stats`, {
      headers: {
        Authorization: token ? token : '',
      },
    });
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching provider dashboard stats:", error);
    // Return mock data as fallback
    return getMockProviderStats();
  }
}

// Customer Dashboard Data
export async function getCustomerDashboardStats() {
  if (USE_MOCK_DATA) {
    return getMockCustomerStats();
  }

  // Get token from Redux or localStorage
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  try {
    const response = await axios.get(`${baseApiUrl}/customer/dashboard-stats`, {
      headers: {
        Authorization: token ? token : '',
      },
    });
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching customer dashboard stats:", error);
    return getMockCustomerStats();
  }
}

// Mock data for development
function getMockAdminStats() {
  return {
    totalUsers: 1250,
    totalProviders: 45,
    totalCustomers: 1205,
    totalOrders: 3450,
    totalRevenue: 125000,
    activeUsers: 850,
    
    // Orders by status
    orderStatusDistribution: [
      { name: "Pending", value: 125 },
      { name: "Processing", value: 85 },
      { name: "Shipped", value: 210 },
      { name: "Delivered", value: 540 }
    ],
    
    // New users over time (last 7 days)
    newUsersOverTime: [
      { date: "2023-06-01", count: 25 },
      { date: "2023-06-02", count: 17 },
      { date: "2023-06-03", count: 32 },
      { date: "2023-06-04", count: 45 },
      { date: "2023-06-05", count: 21 },
      { date: "2023-06-06", count: 18 },
      { date: "2023-06-07", count: 29 }
    ],
    
    // Revenue over time (last 6 months)
    revenueOverTime: [
      { month: "Jan", revenue: 18500 },
      { month: "Feb", revenue: 21300 },
      { month: "Mar", revenue: 25400 },
      { month: "Apr", revenue: 19800 },
      { month: "May", revenue: 22600 },
      { month: "Jun", revenue: 17400 }
    ],
    
    // Recent orders
    recentOrders: [
      { id: "ORD-001", customer: "John Doe", amount: 125, status: "Delivered", date: "2023-06-07" },
      { id: "ORD-002", customer: "Jane Smith", amount: 85, status: "Processing", date: "2023-06-07" },
      { id: "ORD-003", customer: "Bob Johnson", amount: 210, status: "Shipped", date: "2023-06-06" },
      { id: "ORD-004", customer: "Alice Brown", amount: 150, status: "Pending", date: "2023-06-06" },
      { id: "ORD-005", customer: "Charlie Davis", amount: 95, status: "Delivered", date: "2023-06-05" }
    ]
  };
}

function getMockProviderStats() {
  return {
    totalMeals: 45,
    activeMeals: 38,
    totalOrders: 420,
    totalRevenue: 15800,
    averageRating: 4.7,
    
    // Orders by status
    orderStatusDistribution: [
      { name: "Pending", value: 35 },
      { name: "Approved", value: 42 },
      { name: "Processing", value: 28 },
      { name: "Delivered", value: 75 }
    ],
    
    // Revenue over time (last 7 days)
    revenueOverTime: [
      { date: "2023-06-01", revenue: 850 },
      { date: "2023-06-02", revenue: 920 },
      { date: "2023-06-03", revenue: 750 },
      { date: "2023-06-04", revenue: 1100 },
      { date: "2023-06-05", revenue: 980 },
      { date: "2023-06-06", revenue: 1250 },
      { date: "2023-06-07", revenue: 950 }
    ],
    
    // Top meals by orders
    topMeals: [
      { name: "Chicken Biryani", orders: 85, revenue: 1700 },
      { name: "Butter Chicken", orders: 72, revenue: 1440 },
      { name: "Veg Pulao", orders: 58, revenue: 1160 },
      { name: "Paneer Tikka", orders: 45, revenue: 900 },
      { name: "Mutton Curry", orders: 38, revenue: 950 }
    ],
    
    // Recent orders
    recentOrders: [
      { id: "ORD-101", customer: "John Doe", amount: 85, status: "Delivered", date: "2023-06-07" },
      { id: "ORD-102", customer: "Jane Smith", amount: 55, status: "Processing", date: "2023-06-07" },
      { id: "ORD-103", customer: "Bob Johnson", amount: 110, status: "Approved", date: "2023-06-06" },
      { id: "ORD-104", customer: "Alice Brown", amount: 90, status: "Pending", date: "2023-06-06" },
      { id: "ORD-105", customer: "Charlie Davis", amount: 75, status: "Delivered", date: "2023-06-05" }
    ]
  };
}

function getMockCustomerStats() {
  return {
    totalOrders: 28,
    totalSpent: 2450,
    favoriteProvider: "Tasty Bites",
    lastOrderDate: "2023-06-05",
    
    // Order history over time
    orderHistory: [
      { month: "Jan", orders: 3, amount: 250 },
      { month: "Feb", orders: 5, amount: 420 },
      { month: "Mar", orders: 4, amount: 380 },
      { month: "Apr", orders: 6, amount: 520 },
      { month: "May", orders: 5, amount: 450 },
      { month: "Jun", orders: 5, amount: 430 }
    ],
    
    // Order status distribution
    orderStatusDistribution: [
      { name: "Pending", value: 2 },
      { name: "Processing", value: 3 },
      { name: "Shipped", value: 1 },
      { name: "Delivered", value: 22 }
    ],
    
    // Recent orders
    recentOrders: [
      { id: "ORD-201", provider: "Tasty Bites", amount: 85, status: "Delivered", date: "2023-06-05" },
      { id: "ORD-202", provider: "Spice Garden", amount: 95, status: "Processing", date: "2023-06-02" },
      { id: "ORD-203", provider: "Home Kitchen", amount: 75, status: "Pending", date: "2023-06-01" },
      { id: "ORD-204", provider: "Tasty Bites", amount: 110, status: "Delivered", date: "2023-05-28" },
      { id: "ORD-205", provider: "Food Express", amount: 65, status: "Delivered", date: "2023-05-25" }
    ],
    
    // Favorite meals
    favoriteMeals: [
      { name: "Chicken Biryani", orderCount: 8, provider: "Tasty Bites" },
      { name: "Paneer Butter Masala", orderCount: 6, provider: "Spice Garden" },
      { name: "Veg Fried Rice", orderCount: 5, provider: "Home Kitchen" },
      { name: "Butter Chicken", orderCount: 4, provider: "Tasty Bites" },
      { name: "Veg Pulao", orderCount: 3, provider: "Food Express" }
    ]
  };
}

// Get real admin dashboard stats based on user data
export async function getRealAdminDashboardStats(userData: any[], orderData?: any[]) {
  if (!userData || userData.length === 0) {
    return getMockAdminStats();
  }

  // Count users by role
  const totalUsers = userData.length;
  const totalProviders = userData.filter(user => user.role === 'provider').length;
  const totalCustomers = userData.filter(user => user.role === 'user' || user.role === 'customer').length;
  
  // Default values if no order data is provided
  let totalOrders = 0;
  let totalRevenue = 0;
  let orderStatusDistribution = [
    { name: "Pending", value: 0 },
    { name: "Processing", value: 0 },
    { name: "Shipped", value: 0 },
    { name: "Delivered", value: 0 }
  ];
  let revenueOverTime = generateRevenueOverTime(getNewUsersOverTime(userData));
  let recentOrders = [];
  
  // Use actual order data if provided
  if (orderData && orderData.length > 0) {
    totalOrders = orderData.length;
    totalRevenue = orderData.reduce((sum, order) => sum + order.amount, 0);
    
    // Order status distribution
    orderStatusDistribution = [
      { name: "Pending", value: orderData.filter(order => order.status === "Pending").length },
      { name: "Processing", value: orderData.filter(order => order.status === "Processing").length },
      { name: "Shipped", value: orderData.filter(order => order.status === "Shipped").length },
      { name: "Delivered", value: orderData.filter(order => order.status === "Delivered").length }
    ];
    
    // Recent orders (sorted by date, most recent first)
    recentOrders = [...orderData]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(order => ({
        id: order._id,
        customer: order.customer,
        amount: order.amount,
        status: order.status,
        date: order.date
      }));
    
    // Revenue over time (group by month)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    revenueOverTime = months.map(month => ({
      month,
      revenue: 0
    }));
    
    orderData.forEach(order => {
      const orderDate = new Date(order.date);
      const monthIndex = orderDate.getMonth();
      
      // Only include current year and first 6 months
      if (monthIndex < 6 && orderDate.getFullYear() === new Date().getFullYear()) {
        revenueOverTime[monthIndex].revenue += order.amount;
      }
    });
  } else {
    // Fall back to estimates based on user count
    const estimatedOrdersPerUser = 2.8;
    const estimatedRevenuePerOrder = 36;
    
    totalOrders = Math.round(totalUsers * estimatedOrdersPerUser);
    totalRevenue = Math.round(totalOrders * estimatedRevenuePerOrder);
    
    // Orders by status - using estimated data
    orderStatusDistribution = [
      { name: "Pending", value: Math.round(totalOrders * 0.15) },
      { name: "Processing", value: Math.round(totalOrders * 0.25) },
      { name: "Shipped", value: Math.round(totalOrders * 0.2) },
      { name: "Delivered", value: Math.round(totalOrders * 0.4) }
    ];
    
    // Recent orders - using mock data as placeholder
    recentOrders = [
      { id: "ORD-001", customer: "John Doe", amount: 125, status: "Delivered", date: "2023-06-07" },
      { id: "ORD-002", customer: "Jane Smith", amount: 85, status: "Processing", date: "2023-06-07" },
      { id: "ORD-003", customer: "Bob Johnson", amount: 210, status: "Shipped", date: "2023-06-06" },
      { id: "ORD-004", customer: "Alice Brown", amount: 150, status: "Pending", date: "2023-06-06" },
      { id: "ORD-005", customer: "Charlie Davis", amount: 95, status: "Delivered", date: "2023-06-05" }
    ];
  }
  
  const activeUsers = userData.filter(user => !user.isBlocked).length;
  
  // Group users by date to get new users trend
  const newUsersOverTime = getNewUsersOverTime(userData);
  
  return {
    totalUsers,
    totalProviders,
    totalCustomers,
    totalOrders,
    totalRevenue,
    activeUsers,
    
    // Order status distribution from actual data or estimates
    orderStatusDistribution,
    
    // New users over time based on actual registration dates
    newUsersOverTime,
    
    // Revenue over time from actual order data or estimates
    revenueOverTime,
    
    // Recent orders from actual data or mock data
    recentOrders
  };
}

// Helper function to group users by registration date (last 7 days)
function getNewUsersOverTime(userData: any[]) {
  const result = [];
  const today = new Date();
  
  // Create entries for the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    result.push({
      date: dateString,
      count: 0
    });
  }
  
  // Count users by registration date
  userData.forEach(user => {
    if (!user.createdAt) return;
    
    const createdDate = new Date(user.createdAt).toISOString().split('T')[0];
    const entry = result.find(item => item.date === createdDate);
    
    if (entry) {
      entry.count += 1;
    }
  });
  
  return result;
}

// Helper function to generate estimated revenue based on user growth
function generateRevenueOverTime(userGrowth: any[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const avgRevenuePerUser = 100;
  
  return months.map((month, index) => {
    // Generate a value that's somewhat proportional to user growth
    // but also has some randomness to look realistic
    const baseRevenue = 15000 + (index * 1000);
    const userFactor = userGrowth.reduce((sum, item) => sum + item.count, 0) / userGrowth.length;
    const randomFactor = 0.8 + (Math.random() * 0.4); // Random between 0.8 and 1.2
    
    const revenue = Math.round((baseRevenue + (userFactor * avgRevenuePerUser)) * randomFactor);
    
    return {
      month,
      revenue
    };
  });
} 