"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PenLine, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useGetAllBlogsQuery, useDeleteBlogMutation } from "@/redux/features/blogs/blogApi";

export default function BlogsPage() {
  const user = useSelector(currentUser);
  
  // Check if user has permission (admin or provider)
  const hasPermission = useCallback(() => {
    if (!user || !user.role) return false;
    return user.role === 'admin' || user.role === 'provider';
  }, [user]);
  
  // Use RTK Query hook instead of fetch
  const { 
    data: blogsData, 
    isLoading, 
    isError,
    error 
  } = useGetAllBlogsQuery(undefined, {
    // Skip the query if user doesn't have permission
    skip: !hasPermission()
  });
  
  const [deleteBlog] = useDeleteBlogMutation();

  const handleDeleteBlog = async (blogId: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      // Check permission
      if (!hasPermission()) {
        toast.error("You don't have permission to delete blogs");
        return;
      }

      // Use the mutation hook instead of fetch
      await deleteBlog(blogId).unwrap();
      toast.success("Blog deleted successfully!");
      
    } catch (err) {
      console.error("Failed to delete blog:", err);
      if (err && typeof err === 'object' && 'data' in err) {
        const errorData = err.data as { message?: string };
        toast.error(errorData?.message || "Failed to delete blog");
      } else if (err instanceof Error) {
        toast.error(err.message || "Failed to delete blog");
      } else {
        toast.error("Failed to delete blog. Please try again later.");
      }
    }
  };

  // Process blogs data from response
  const blogs = blogsData?.data || [];
  
  if (!hasPermission()) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access this page.</p>
          <Button onClick={() => window.location.href = '/login'}>
            Log In Again
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage = error && 
      typeof error === 'object' && 
      'data' in error && 
      error.data && 
      typeof error.data === 'object' && 
      'message' in error.data && 
      typeof error.data.message === 'string'
        ? error.data.message 
        : "Failed to load blogs. Please try again later.";
        
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-3 text-center">
        <p className="text-red-500">
          {errorMessage}
        </p>
        <Link href="/dashboard/admin/blogs/create">
          <Button size="sm" className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add New Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Manage Blogs</h1>
        <p className="mt-2 text-lg text-gray-600">
          Create, edit, and manage blog posts
        </p>
      </div>
      <div className="mr-4 mb-4 flex justify-end">
        <Link href="/dashboard/admin/blogs/create">
          <Button size="sm" className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add New Blog
          </Button>
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 p-3 text-center">
          <p className="text-xl font-medium">
            No blogs found. Create your first blog post!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {blogs.map((blog) => (
            <Card key={blog._id} className="overflow-hidden border-gray-300 flex flex-col h-auto shadow-sm hover:shadow transition-shadow">
              {blog.image && (
                <div
                  className="h-[140px] w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${blog.image})` }}
                />
              )}
              <CardContent className="space-y-2 p-3 flex flex-col flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
                    {blog.title}
                  </h3>
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    {blog.category}
                  </Badge>
                </div>

                <div className="flex-grow min-h-[60px]">
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {blog.content}
                  </p>
                </div>

                <div className="text-xs text-gray-500">
                  <p>
                    <strong>Author:</strong> {blog.author}
                  </p>
                  <p>
                    <strong>Published:</strong>{" "}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-1 mt-auto">
                  <Link href={`/blog/${blog._id}`} target="_blank">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex items-center gap-1 h-7 px-2 text-xs transition-colors hover:bg-gray-100"
                    >
                      View
                    </Button>
                  </Link>
                  <Link href={`/dashboard/admin/blogs/edit/${blog._id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 h-7 px-2 text-xs transition-colors hover:bg-gray-100"
                    >
                      <PenLine size={12} /> Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex items-center gap-1 h-7 px-2 text-xs transition-colors hover:opacity-90"
                    onClick={() => {
                      handleDeleteBlog(blog._id);
                    }}
                  >
                    <Trash2 size={12} /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 