"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, LogIn } from "lucide-react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import Link from "next/link";

// Mock data for fallback when API is unavailable
const MOCK_SUBSCRIBERS = [
  {
    id: "1",
    email: "j37@gmail.com",
    isSubscribed: true,
    createdAt: "2025-06-06T11:47:22.396Z",
    updatedAt: "2025-06-06T11:47:22.396Z"
  },
  {
    id: "2",
    email: "j827@gmail.com",
    isSubscribed: true,
    createdAt: "2025-06-06T11:45:22.396Z",
    updatedAt: "2025-06-06T11:45:22.396Z"
  },
  {
    id: "3",
    email: "j278@gmail.com",
    isSubscribed: true,
    createdAt: "2025-06-06T11:43:22.396Z",
    updatedAt: "2025-06-06T11:43:22.396Z"
  },
  {
    id: "4",
    email: "j27@gmail.com",
    isSubscribed: true,
    createdAt: "2025-06-06T11:42:22.396Z",
    updatedAt: "2025-06-06T11:42:22.396Z"
  },
  {
    id: "5",
    email: "j7@gmail.com",
    isSubscribed: true,
    createdAt: "2025-06-06T11:31:22.396Z",
    updatedAt: "2025-06-06T11:31:22.396Z"
  }
];

// Define interface for subscriber data
interface Subscriber {
  id?: string;
  _id?: string;
  email: string;
  isSubscribed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function NewsletterSubscribers() {
  const { isChecking, isAuthenticated, redirectToLogin, token } = useAdminAuth();
  
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  // Function to use mock data as fallback
  const loadMockData = useCallback(() => {
    console.log('Loading mock subscriber data as fallback');
    setSubscribers(MOCK_SUBSCRIBERS);
    setUseMockData(true);
    setError(null);
    setIsLoading(false);
  }, []);

  // Direct API fetch implementation
  const fetchSubscribers = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError("Authentication required. Please log in first.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setUseMockData(false);
    
    // Log the token format for debugging
    console.log('Fetching with token:', token ? token.substring(0, 15) + '...' : 'No token');
    
    // Get the stored token from localStorage as well
    const storedToken = localStorage.getItem('token');
    console.log('Token in localStorage:', storedToken ? storedToken.substring(0, 15) + '...' : 'No token');
    
    // Ensure token has the Bearer prefix
    let authToken = token;
    if (token && !token.startsWith('Bearer ')) {
      authToken = `Bearer ${token}`;
    }
    
    // Check for token in localStorage if redux token doesn't work
    let localStorageAuthToken = storedToken;
    if (localStorageAuthToken && !localStorageAuthToken.startsWith('Bearer ')) {
      localStorageAuthToken = `Bearer ${localStorageAuthToken}`;
    }
    
    try {
      // Try multiple auth methods
      let apiUrl = "https://feedme-backend-zeta.vercel.app/api/newsletter/all";
      
      // Method 1: Redux token with Bearer prefix
      console.log('Trying API with Redux token + Bearer prefix:', apiUrl);
      let response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": authToken
        },
        credentials: "include"
      });
      
      let responseText;
      try {
        // Try to get error message for better debugging
        responseText = await response.text();
        console.log('API Error Response Text:', responseText);
        
        // Try to parse it back to JSON if possible
        try {
          const errorJson = JSON.parse(responseText);
          console.log('API Error JSON:', errorJson);
        } catch {}
      } catch {}
      
      // Method 2: localStorage token if Method 1 failed
      if (response.status === 401 && localStorageAuthToken && localStorageAuthToken !== authToken) {
        console.log('Trying with localStorage token instead');
        response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": localStorageAuthToken
          },
          credentials: "include"
        });
      }
      
      // Method 3: Try without 'Bearer' prefix
      if (response.status === 401) {
        console.log('Trying without Bearer prefix');
        response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": token // Raw token without Bearer
          },
          credentials: "include"
        });
      }
      
      // Method 4: Try without credentials: "include"
      if (response.status === 401) {
        console.log('Trying without credentials:include');
        response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": authToken
          }
        });
      }
      
      // Method 5: Try different URL
      if (response.status === 401) {
        console.log('Trying different API URL format');
        apiUrl = "https://feedme-backend-zeta.vercel.app/api/newsletter";
        
        response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": authToken
          }
        });
      }
      
      console.log('Final API response status:', response.status);
      
      // For debugging - log response headers
      console.log('API response headers:', Object.fromEntries([...response.headers.entries()]));
      
      if (response.status === 401) {
        // All attempts failed with 401
        console.log('All authentication attempts failed with 401');
        
        // Fetch without auth to see if the endpoint exists
        const noAuthResponse = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });
        console.log('Response without auth:', noAuthResponse.status);
        
        // Fallback to mock data, but with a more specific error
        setError("Authentication failed. Please check your credentials and try logging in again.");
        loadMockData();
        return;
      }
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      // Success! Parse the data
      let data;
      try {
        data = await response.json();
        console.log('API response data:', data);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('Invalid API response format');
      }
      
      if (data && data.data && Array.isArray(data.data)) {
        setSubscribers(data.data);
        setUseMockData(false);
      } else if (Array.isArray(data)) {
        setSubscribers(data);
        setUseMockData(false);
      } else {
        console.error("Unexpected data format from API:", data);
        setError("Received unexpected data format from server");
        loadMockData();
      }
    } catch (err) {
      console.error("Error fetching newsletter subscribers:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load subscribers";
      setError(errorMessage);
      
      // Fallback to mock data on error
      console.log('Error occurred, falling back to mock data');
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token, loadMockData]);

  useEffect(() => {
    // Only fetch data if authenticated and not still checking
    if (isAuthenticated && !isChecking) {
      fetchSubscribers();
    }
  }, [isAuthenticated, isChecking, token, fetchSubscribers]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch (err) {
      console.error("Date formatting error:", err);
      return "Invalid date";
    }
  };

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3">Checking authorization...</span>
      </div>
    );
  }

  // Authentication prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Newsletter Subscribers</h1>
        
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
              <p className="text-gray-500">Please log in with admin credentials to view newsletter subscribers.</p>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={redirectToLogin} className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Log In
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/admin">Return to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Newsletter Subscribers</h1>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Subscribers</CardTitle>
            {useMockData && (
              <p className="text-yellow-600 text-xs mt-1">
                Using demo data (API connection failed)
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {useMockData && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Debugging function to examine token
                    const storedToken = localStorage.getItem('token');
                    alert(`Token info:\n` + 
                          `Redux token: ${token ? 'exists' : 'missing'}\n` +
                          `localStorage token: ${storedToken ? 'exists' : 'missing'}\n\n` +
                          `Try running the following commands in the browser console:\n` +
                          `1. localStorage.getItem('token')\n` +
                          `2. window.debugAuth.logAuthStatus()`
                    );
                    
                    // Try to auto-fix token format in localStorage
                    if (storedToken && !storedToken.startsWith('Bearer ')) {
                      localStorage.setItem('token', `Bearer ${storedToken}`);
                      alert('Added "Bearer " prefix to localStorage token. Refreshing...');
                      window.location.reload();
                    }
                  }}
                  className="bg-blue-50"
                >
                  Debug Token
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={redirectToLogin}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Log In Again
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchSubscribers} 
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4 text-red-500">
              <p className="font-medium mb-2">Error: {error}</p>
              <p className="text-sm">
                If this issue persists, please verify your API configuration and authentication credentials.
              </p>
              {error.includes("session has expired") ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={redirectToLogin}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Log In Again
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={fetchSubscribers}
                >
                  Try Again
                </Button>
              )}
            </div>
          ) : subscribers.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No subscribers found
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscribed On</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber, index) => (
                    <TableRow key={subscriber.id || subscriber._id || index}>
                      <TableCell className="font-medium">
                        {subscriber.email}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={subscriber.isSubscribed ? "default" : "secondary"}
                          className={subscriber.isSubscribed ? "bg-green-500" : "bg-gray-500"}
                        >
                          {subscriber.isSubscribed ? "Subscribed" : "Unsubscribed"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(subscriber.createdAt)}</TableCell>
                      <TableCell>{formatDate(subscriber.updatedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 