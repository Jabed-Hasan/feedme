import { baseApi } from "@/redux/api/baseApi";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";

export interface OrderData {
  _id: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  date: string;
  products?: any[];
  address?: string;
  trackingNumber?: string;
  email?: string;
}

// Mock data generator for development
const generateMockOrders = (): OrderData[] => {
  const statuses: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered"];
  const customers = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown", "Charlie Davis", 
                    "Eva Wilson", "Michael Clark", "Sophia Lee", "Daniel Kim", "Olivia Taylor"];
  const orders: OrderData[] = [];
  
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

// Generate distribution data
export const getOrderStatusDistribution = (orders: OrderData[]) => {
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

// Generate revenue data by month
export const getRevenueByMonth = (orders: OrderData[]) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const revenueByMonth = months.map(month => ({
    month,
    revenue: 0
  }));
  
  orders.forEach(order => {
    const orderDate = new Date(order.date);
    const monthIndex = orderDate.getMonth();
    
    // Only count orders from current year and first 6 months
    if (monthIndex < 6 && orderDate.getFullYear() === new Date().getFullYear()) {
      revenueByMonth[monthIndex].revenue += order.amount;
    }
  });
  
  return revenueByMonth;
};

// Define the order API
export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query<OrderData[], void>({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
      // Always return mock data for development, following the pattern in order.ts
      transformResponse: (response: any) => {
        try {
          // If there's response data and it's an array, use it
          if (response?.data && Array.isArray(response.data)) {
            return response.data.map((order: any) => ({
              _id: order._id || order.id || `ORD-${Math.floor(Math.random() * 10000)}`,
              customer: order.name || order.customer || 'Customer',
              amount: order.totalPrice || order.amount || 0,
              status: order.status || 'Pending',
              date: order.createdAt || order.date || new Date().toISOString()
            }));
          }
          
          // Otherwise return mock data
          return generateMockOrders();
        } catch (error) {
          console.error("Error transforming order data:", error);
          return generateMockOrders();
        }
      },
      // Handle errors
      transformErrorResponse: (response: { status: string | number; data: any }) => {
        console.log("Error response received:", response);
        return { status: response.status, message: response.data?.message || "Failed to fetch orders" };
      },
      providesTags: ["Order"],
    }),
    
    getRecentOrders: builder.query<OrderData[], number>({
      query: (limit = 5) => ({
        // Use the same endpoint as orders but with different path - no limit query parameter
        url: `/orders/recent`,
        method: "GET",
      }),
      // Mock response for development
      transformResponse: (response: any, _, limit = 5) => {
        try {
          // If there's response data and it's an array, use it
          if (response?.data && Array.isArray(response.data)) {
            return response.data
              .slice(0, limit)
              .map((order: any) => ({
                _id: order._id || order.id || `ORD-${Math.floor(Math.random() * 10000)}`,
                customer: order.name || order.customer || 'Customer',
                amount: order.totalPrice || order.amount || 0,
                status: order.status || 'Pending',
                date: order.createdAt || order.date || new Date().toISOString()
              }));
          }
          
          // Otherwise return mock data
          const allOrders = generateMockOrders();
          
          // Sort by date descending and take the first 'limit' orders
          return allOrders
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit);
        } catch (error) {
          console.error("Error transforming recent order data:", error);
          return generateMockOrders()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit);
        }
      },
      // Handle errors
      transformErrorResponse: (response: { status: string | number; data: any }) => {
        console.log("Error response received for recent orders:", response);
        return { status: response.status, message: response.data?.message || "Failed to fetch recent orders" };
      },
      providesTags: ["Order"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllOrdersQuery,
  useGetRecentOrdersQuery,
} = orderApi; 