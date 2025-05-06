import { baseApi } from "@/redux/api/baseApi";
import { RootState } from "@/redux/store";

export interface Subscriber {
  id: string;
  email: string;
  isSubscribed: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubscribeResponse {
  status: boolean;
  message: string;
}

export interface SubscribersResponse {
  status: boolean;
  message: string;
  data: Subscriber[];
}

const BACKEND_URL = "https://feedme-backend-zeta.vercel.app/api";

// Helper for token formatting
const getFormattedToken = (token: string | null) => {
  if (!token) return "";
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
};

// Helper to get best available token
const getBestToken = () => {
  // First try Redux state
  const state = (baseApi.getState() as RootState);
  const reduxToken = state?.auth?.token;
  
  // Then try localStorage
  let localStorageToken = null;
  if (typeof window !== 'undefined') {
    localStorageToken = localStorage.getItem('token');
  }
  
  // Use the first available token
  const token = reduxToken || localStorageToken || "";
  return getFormattedToken(token);
};

// Newsletter API endpoints
const newsletterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscribers: builder.query<Subscriber[], void>({
      query: () => {
        const token = getBestToken();
        console.log('Newsletter API using token:', token ? `${token.substring(0, 15)}...` : 'No token');
        
        return {
          url: `${BACKEND_URL}/newsletter/all`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": token
          },
        };
      },
      // Transform the response to extract the subscribers array
      transformResponse: (response: SubscribersResponse) => {
        // If the response has a data property and it's an array, return it
        if (response && response.data && Array.isArray(response.data)) {
          return response.data;
        }
        // If the response itself is an array, return it
        if (Array.isArray(response)) {
          return response;
        }
        // Default to empty array if we can't extract subscribers
        console.warn("Unexpected response format from newsletter API:", response);
        return [];
      },
      providesTags: ["Newsletter"],
      // Don't retry on auth errors
      extraOptions: {
        maxRetries: 0,
      }
    }),
    
    subscribe: builder.mutation<SubscribeResponse, { email: string }>({
      query: (data) => {
        const token = getBestToken();
        
        return {
          url: `${BACKEND_URL}/newsletter/subscribe`,
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": token
          },
        };
      },
      invalidatesTags: ["Newsletter"],
    }),
    
    unsubscribe: builder.mutation<SubscribeResponse, { email: string }>({
      query: (data) => {
        const token = getBestToken();
        
        return {
          url: `${BACKEND_URL}/newsletter/unsubscribe`,
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": token
          },
        };
      },
      invalidatesTags: ["Newsletter"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllSubscribersQuery,
  useSubscribeMutation,
  useUnsubscribeMutation,
} = newsletterApi; 