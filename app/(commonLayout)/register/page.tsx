"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignUpMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormData = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: string;
};

type BackendErrorResponse = {
  message?: string;
  errorSources?: Array<{
    path?: string;
    message?: string;
  }>;
  success?: boolean;
};

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      role: "customer",
    },
  });
  const [SignUp] = useSignUpMutation();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    const userInfo = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      address: data.address,
      role: data.role,
    };

    try {
      const response = await SignUp(userInfo);

      if ("error" in response) {
        const errorResponse = response.error;
        if (errorResponse && "data" in errorResponse && errorResponse.data) {
          const errorData = errorResponse.data as BackendErrorResponse;

          // Check for error message in errorSources array (for duplicate email etc.)
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
        if (response.data.status && response.data.message) {
          toast.success(response.data.message);
          router.push("/login");
          reset();
        } else if (response.data.message) {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      // No toast for unexpected errors unless there's a message from the backend
      if (error && typeof error === "object" && "message" in error) {
        const errorMessage = (error as { message: string }).message;
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-feed-lime relative hidden md:block">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative flex h-full flex-col justify-center p-12">
              <h3 className="text-feed-black text-4xl font-semibold md:text-5xl lg:text-6xl">
                Join Us
                <br />
                Today!
              </h3>
              <p className="text-feed-jungle/90 mt-4 text-lg">
                Create an account to start your journey towards better nutrition
                and healthier living.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center px-8 py-10 sm:px-12 md:py-15">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="text-center text-3xl font-semibold tracking-tight text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-feed-jungle hover:text-feed-black font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full name
                  </label>
                  <div className="mt-1">
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="block h-10 w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-base focus:border-feed-jungle focus:ring-2 focus:ring-feed-jungle/20 focus:outline-none"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

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
                      className="block h-10 w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-base focus:border-feed-jungle focus:ring-2 focus:ring-feed-jungle/20 focus:outline-none"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      className="block h-10 w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-base focus:border-feed-jungle focus:ring-2 focus:ring-feed-jungle/20 focus:outline-none"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="block h-10 w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-base focus:border-feed-jungle focus:ring-2 focus:ring-feed-jungle/20 focus:outline-none"
                        {...register("phone", {
                          required: "Phone number is required",
                        })}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Role
                    </label>
                    <div className="mt-1">
                      <Select onValueChange={(value) => setValue("role", value)}>
                        <SelectTrigger className="focus:border-feed-jungle focus:ring-feed-jungle/20 h-10 w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-base focus:ring-2 focus:outline-none">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="provider">Meal Provider</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.role && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.role.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="mt-1">
                    <Input
                      id="address"
                      type="text"
                      placeholder="Enter your address"
                      className="block h-10 w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-base focus:border-feed-jungle focus:ring-2 focus:ring-feed-jungle/20 focus:outline-none"
                      {...register("address", {
                        required: "Address is required",
                      })}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    className="bg-feed-jungle hover:bg-feed-black h-10 w-full rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 focus:ring-2 focus:ring-feed-jungle focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create account"}
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
