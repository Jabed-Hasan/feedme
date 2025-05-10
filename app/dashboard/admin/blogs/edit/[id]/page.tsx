"use client";

import { useState, ChangeEvent, FormEvent, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useParams } from "next/navigation";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetBlogByIdQuery, useUpdateBlogMutation } from "@/redux/features/blogs/blogApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface BlogData {
  title: string;
  content: string;
  category: string;
  author: string;
  image: string;
}

export default function EditBlogForm() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;
  
  // Get authentication state from Redux
  const user = useSelector(currentUser);
  
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  
  const initialBlogData: BlogData = {
    title: "",
    content: "",
    category: "Food",
    author: "",
    image: "",
  };
  
  const [blogData, setBlogData] = useState<BlogData>(initialBlogData);

  // Check if user has permission (admin or provider)
  const hasPermission = useCallback(() => {
    if (!user || !user.role) return false;
    return user.role === 'admin' || user.role === 'provider';
  }, [user]);
  
  // Use RTK Query hook for fetching blog
  const { 
    data: blogDetails, 
    isLoading: isFetching, 
    isError,
    error 
  } = useGetBlogByIdQuery(blogId, {
    // Skip the query if user doesn't have permission
    skip: !hasPermission() || !blogId
  });
  
  // Use RTK Query hook for updating blog
  const [updateBlog] = useUpdateBlogMutation();

  // Set blog data when fetched
  useEffect(() => {
    if (blogDetails && blogDetails.data) {
      const blog = blogDetails.data;
      setBlogData({
        title: blog.title || "",
        content: blog.content || "",
        category: blog.category || "Food",
        author: blog.author || "",
        image: blog.image || "",
      });
      setImageUrl(blog.image || "");
    }
  }, [blogDetails]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const categories = ["Food", "Technology", "Health", "Business", "Lifestyle", "Travel", "Other"];

  // Update the image URL in state when it changes
  useEffect(() => {
    if (imageUrl) {
      setBlogData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    }
  }, [imageUrl]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!blogData.title || !blogData.content || !blogData.author) {
        toast.error("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      // Check permission
      if (!hasPermission()) {
        toast.error("You don&apos;t have permission to edit blogs");
        setIsLoading(false);
        return;
      }

      // Add the image URL to the blog data
      const blogWithImage = {
        ...blogData,
        image: imageUrl || "",
      };

      // Use the update mutation
      const result = await updateBlog({
        blogId,
        data: blogWithImage
      }).unwrap();

      console.log("Blog updated successfully", result);
      toast.success("Blog updated successfully!");
      router.push("/dashboard/admin/blogs");
    } catch (err) {
      console.error("Failed to update blog:", err);
      if (err && typeof err === 'object' && 'data' in err) {
        const errorData = err.data as { message?: string };
        toast.error(errorData?.message || "Failed to update blog");
      } else if (err instanceof Error) {
        toast.error(err.message || "Failed to update blog");
      } else {
        toast.error("Failed to update blog. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasPermission()) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">Your session has expired or you don&apos;t have permission to access this page.</p>
          <Button onClick={() => router.push('/login')}>
            Log In Again
          </Button>
        </div>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
          <p>Loading blog data...</p>
        </div>
      </div>
    );
  }
  
  if (isError) {
    const errorMessage = (() => {
      if (error) {
        // Handle FetchBaseQueryError type
        if ('data' in error) {
          const fetchError = error as FetchBaseQueryError;
          if (typeof fetchError.data === 'object' && fetchError.data && 'message' in fetchError.data) {
            return String(fetchError.data.message);
          }
        }
        // Handle other error types that might have a message property
        if ('message' in error && typeof error.message === 'string') {
          return error.message;
        }
      }
      return "Failed to load blog. Please try again later.";
    })();
    
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Blog</h2>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <Button onClick={() => router.push('/dashboard/admin/blogs')}>
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Edit Blog Post</h1>
        <p className="mt-2 text-lg text-gray-600">
          Update your blog post information
        </p>
      </div>
      <Card className="mx-auto mt-10 w-full max-w-4xl rounded-2xl border p-3 md:p-6">
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* Title */}
            <div className="grid gap-1">
              <Label htmlFor="title">Title</Label>
              <Input
                name="title"
                id="title"
                placeholder="Blog Title"
                value={blogData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Content */}
            <div className="grid gap-1">
              <Label htmlFor="content">Content</Label>
              <div className="relative">
                <Textarea
                  name="content"
                  id="content"
                  placeholder="Blog Content"
                  value={blogData.content}
                  onChange={handleChange}
                  className="min-h-[200px] max-h-[400px] scrollbar-textarea"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="grid gap-1">
              <Label>Blog Image</Label>
              {imageUrl ? (
                <div className="flex flex-col items-center gap-4">
                  <CldImage
                    width="600"
                    height="400"
                    src={imageUrl}
                    alt="Blog cover image"
                    className="rounded-lg object-cover"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setImageUrl("")}
                    type="button"
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <CldUploadWidget
                  uploadPreset="feedme"
                  onSuccess={(result) => {
                    // Check if result has info property and secure_url
                    const info = result.info as { secure_url?: string };
                    if (info?.secure_url) {
                      setImageUrl(info.secure_url);
                    }
                  }}
                  options={{
                    multiple: false,
                    sources: ["local"],
                    maxFiles: 1,
                    cropping: true,
                    croppingAspectRatio: 16 / 9,
                    showPoweredBy: false,
                    cloudName: "dciqyeuyp",
                  }}
                >
                  {({ open }: { open: () => void }) => {
                    return (
                      <div
                        className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                        onClick={() => open()}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="mb-4 h-8 w-8 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, or WEBP (MAX. 5MB)
                          </p>
                        </div>
                      </div>
                    );
                  }}
                </CldUploadWidget>
              )}
            </div>

            {/* Category */}
            <div className="grid gap-1">
              <Label htmlFor="category">Category</Label>
              <Select
                value={blogData.category}
                onValueChange={(value) => 
                  setBlogData((prev) => ({ ...prev, category: value }))
                }
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Author */}
            <div className="grid gap-1">
              <Label htmlFor="author">Author</Label>
              <Input
                name="author"
                id="author"
                placeholder="Author Name"
                value={blogData.author}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push("/dashboard/admin/blogs")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Blog Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 