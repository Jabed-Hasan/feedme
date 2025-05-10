"use client";

import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllBlogsQuery } from "@/redux/features/blogs/blogApi";
import { Skeleton } from "@/components/ui/skeleton";

const Blog = () => {
  const { data: blogsData, isLoading, isError } = useGetAllBlogsQuery(undefined);
  // Process blogs data from response
  const blogs = blogsData?.data || [];

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Estimate read time based on content length (approximately 200 words per minute)
  const getReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / 200);
    return `${readTime} min read`;
  };

  // Display only the first 3 blogs
  const displayBlogs = blogs.slice(0, 3);

  // If no real blog data is available yet, use sample data
  const placeholderBlogs = [
    {
      _id: "1",
      title: "5 Benefits of Meal Prep for Busy Professionals",
      content: "Discover how meal preparation can save you time, money, and help maintain a balanced diet...",
      createdAt: "2024-05-15",
      author: "Sarah Johnson",
      category: "Nutrition",
      image: "/images/placeholder.jpg",
    },
    {
      _id: "2",
      title: "The Ultimate Guide to Balanced Nutrition",
      content: "Learn about macronutrients, micronutrients, and how to create perfectly balanced meals...",
      createdAt: "2024-05-10",
      author: "Dr. Michael Chen",
      category: "Health",
      image: "/images/placeholder.jpg",
    },
    {
      _id: "3",
      title: "Seasonal Ingredients to Add to Your Meals This Summer",
      content: "Explore the freshest summer ingredients and how to incorporate them into your meal plans...",
      createdAt: "2024-05-03",
      author: "Emma Davis",
      category: "Seasonal",
      image: "/images/placeholder.jpg",
    },
  ];
  
  // Use placeholder data if no blogs are available
  const finalBlogs = displayBlogs.length > 0 ? displayBlogs : placeholderBlogs;

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-feed-black">
            Latest from Our Blog
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our articles on nutrition, healthy eating habits, and meal preparation tips
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <Skeleton className="h-4 w-24 mr-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-7 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Failed to load blog posts. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {finalBlogs.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="relative h-48 w-full bg-gray-200">
                  {post.image && (
                    <div 
                      className="h-full w-full bg-cover bg-center" 
                      style={{ backgroundImage: `url(${post.image})` }}
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-feed-jungle text-feed-lime text-xs font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{getReadTime(post.content)}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-feed-black mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      By {post.author}
                    </span>
                    <Link
                      href={`/blog/${post._id}`}
                      className="text-feed-jungle flex items-center text-sm font-medium hover:text-feed-jungle/80 transition-colors"
                    >
                      Read more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-center mt-10">
          <Link href="/blog">
            <Button className="bg-feed-jungle text-white hover:bg-feed-jungle/90 flex gap-2 items-center">
              View All Articles <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog; 