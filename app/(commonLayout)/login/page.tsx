"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignInMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SignInFormData = {
  email: string;
  password: string;
};

type BackendErrorResponse = {
  message?: string;
  errorSources?: Array<{
    path?: string;
    message?: string;
  }>;
  success?: boolean;
  status?: boolean;
  error?: string;
};

export default function SignIn() {
  const [SignIn] = useSignInMutation();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  // For debugging purposes, check if token exists on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token in localStorage on login page load:', token ? `${token.substring(0, 15)}...` : 'No token');
  }, []);

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    const userData = {
      email: data.email,
      password: data.password,
    };
    
    console.log('Attempting login with:', userData.email);
    
    try {
      const response = await SignIn(userData);
      console.log('Login response:', response);

      if ("error" in response) {
        const errorResponse = response.error;
        console.error('Login error response:', errorResponse);
        
        if (errorResponse && "data" in errorResponse && errorResponse.data) {
          const errorData = errorResponse.data as BackendErrorResponse;

          // Check for error message in errorSources array
          if (
            errorData.errorSources &&
            Array.isArray(errorData.errorSources) &&
            errorData.errorSources.length > 0 &&
            errorData.errorSources[0].message
          ) {
            toast.error(errorData.errorSources[0].message);
          }
          // Fallback to general message if available
          else if (errorData.message) {
            toast.error(errorData.message);
          }
        }
        setIsLoading(false);
        return;
      }

      if (response.data) {
        const { data: responseData } = response;
        console.log('Login successful response data:', responseData);
        
        if (responseData.status) {
          // Handle token based on the response structure
          let token = null;
          
          if (responseData.data?.token) {
            token = responseData.data.token;
          } else if (responseData.token) {
            token = responseData.token;
          }
          
          if (token) {
            console.log('Saving token to localStorage:', token.substring(0, 15) + '...');
            localStorage.setItem("token", token);
            
            // Make sure we're saving the correct structure to Redux
            // Check if the response has the expected structure
            const userDataForRedux = {
              user: responseData.data?.verifyUser || responseData.data?.user || null,
              token: token
            };
            
            console.log('Dispatching to Redux:', userDataForRedux);
            dispatch(setUser(userDataForRedux));
          } else {
            console.error('No token found in response:', responseData);
          }

          if (responseData.message) {
            toast.success(responseData.message);
          }

          // Save user role to localStorage for easier access
          if (responseData.data?.verifyUser?.role || responseData.data?.user?.role) {
            const role = responseData.data?.verifyUser?.role || responseData.data?.user?.role;
            localStorage.setItem("userRole", role);
          }

          // Redirect based on user role
          const role = responseData.data?.verifyUser?.role || responseData.data?.user?.role;
          if (role === 'admin') {
            router.push("/dashboard/admin");
          } else {
            router.push("/");
          }
          
          router.refresh();
          setIsLoading(false);
        } else if (responseData.message) {
          toast.error(responseData.message);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      // No toast for unexpected errors unless there's a message from the backend
      if (error && typeof error === "object" && "message" in error) {
        const errorMessage = (error as { message: string }).message;
        toast.error(errorMessage);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-feed-lime relative hidden md:block">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative flex h-full flex-col justify-center p-12">
              <h3 className="text-feed-black text-4xl font-semibold md:text-5xl lg:text-6xl">
                Welcome
                <br />
                Back!
              </h3>
              <p className="text-feed-jungle/90 mt-4 text-lg">
                Sign in to access your personalized meal plans and track your
                nutrition journey.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center px-8 py-10 sm:px-12 md:py-15">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="text-center text-3xl font-semibold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-feed-jungle hover:text-feed-black font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="block h-10 w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-base focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 focus:outline-none"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-feed-jungle hover:text-feed-black text-sm font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="mt-1">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="block h-10 w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-base focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 focus:outline-none"
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="text bg-feed-jungle hover:bg-feed-black focus:ring-feed-lime h-10 w-full rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
