import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// Define a fallback API URL in case environment variable is not set
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://feedme-backend-zeta.vercel.app/api";

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["User", "Meal", "Newsletter", "Blogs", "Order", "Reviews"],
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
    prepareHeaders: (Headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        Headers.set("authorization", token);
      }
      return Headers;
    },
    // Add additional configuration for handling fetch errors
    fetchFn: async (...args) => {
      try {
        const response = await fetch(...args);

        // Check for successful HTTP status
        if (!response.ok) {
          // Try to parse error response
          let errorData;
          try {
            errorData = await response.clone().json();
          } catch (e) {
            // If we can't parse JSON, use text
            try {
              errorData = { message: await response.clone().text() };
            } catch (textError) {
              errorData = { message: `HTTP error ${response.status}` };
            }
          }

          // Add error data to response for RTK Query to handle
          (response as any).errorData = errorData;
        }

        return response;
      } catch (error) {
        console.error("Network error in API call:", error);
        // Create a Response object that includes the network error information
        const errorResponse = new Response(
          JSON.stringify({
            message:
              "Network connection error. Please check your internet connection.",
          }),
          {
            status: 500,
            statusText: "Network Error",
            headers: { "Content-Type": "application/json" },
          },
        );

        // Add the original error for debugging
        (errorResponse as any).originalError = error;

        return errorResponse;
      }
    },
  }),
  endpoints: () => ({}),
});
