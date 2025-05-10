"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, ArrowRight, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetAllBlogsQuery } from "@/redux/features/blogs/blogApi";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Skeleton } from "@/components/ui/skeleton";

// Add interface for blog data
interface BlogType {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
  category: string;
  image?: string;
}

export default function AllArticlesPage() {
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state for hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch all blogs using the Redux RTK Query hook
  const { data: blogsData, isLoading, isError } = useGetAllBlogsQuery(undefined);
  
  // Process blogs data from response
  const blogs = blogsData?.data || [];
  
  // Get unique categories for filter
  const categories = blogs.length > 0 
    ? Array.from(new Set(blogs.map((blog: BlogType) => blog.category))) 
    : ["Nutrition", "Health", "Seasonal", "Lifestyle", "Recipe", "Tips"];
  
  // Filter and search blogs
  const filteredBlogs = blogs.filter((blog: BlogType) => {
    const matchesSearch = searchTerm === "" || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === "" || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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

  // If no real blog data is available yet, use sample data
  const placeholderBlogs = [
    {
      _id: "1",
      title: "5 Benefits of Meal Prep for Busy Professionals",
      content: "Discover how meal preparation can save you time, money, and help maintain a balanced diet. Planning your meals in advance helps eliminate impulsive food choices, reduces food waste, and ensures you're getting the nutrients your body needs throughout the week. We explore how dedicated weekend prep sessions can transform your nutrition habits.",
      createdAt: "2024-05-15",
      author: "Sarah Johnson",
      category: "Nutrition",
      image: "/images/meal-prep.jpg",
    },
    {
      _id: "2",
      title: "The Ultimate Guide to Balanced Nutrition",
      content: "Learn about macronutrients, micronutrients, and how to create perfectly balanced meals. This comprehensive guide breaks down what your body needs, from proteins and carbohydrates to essential vitamins and minerals. Discover how different food groups work together to fuel your body effectively and support optimal health.",
      createdAt: "2024-05-10",
      author: "Dr. Michael Chen",
      category: "Health",
      image: "/images/balanced-nutrition.jpg",
    },
    {
      _id: "3",
      title: "Seasonal Ingredients to Add to Your Meals This Summer",
      content: "Explore the freshest summer ingredients and how to incorporate them into your meal plans. From vibrant tomatoes and zucchini to sweet berries and stone fruits, summer's bounty offers incredible flavor and nutrition. We provide creative ways to make the most of seasonal produce when it's at its peak quality and affordability.",
      createdAt: "2024-05-03",
      author: "Emma Davis",
      category: "Seasonal",
      image: "/images/summer-ingredients.jpg",
    },
    {
      _id: "4",
      title: "Japanese Cheesecake Recipe That Will Impress Your Guests",
      content: "Japanese cheesecake is the perfect blend of airy soufflé and creamy cheesecake. Unlike its dense American counterpart, this delicate dessert has a cloudlike texture that melts in your mouth. Our step-by-step recipe ensures perfect results every time, with tips to achieve that signature wobble and preventing cracks in your cake.",
      createdAt: "2024-05-07",
      author: "Yuki Tanaka",
      category: "Recipe",
      image: "/images/japanese-cheesecake.jpg",
    },
    {
      _id: "5",
      title: "Apricot Chicken with Charred Scallions - Weekend Special",
      content: "This apricot glazed chicken with charred scallions combines sweet, tangy, and smoky flavors in perfect harmony. The dish features tender chicken thighs with a caramelized fruit glaze that creates a beautiful balance between sweetness and depth. Learn how to properly char scallions to add a complex smoky element that elevates this simple weeknight meal.",
      createdAt: "2024-05-07",
      author: "Lindsay Ostrom",
      category: "Recipe",
      image: "/images/apricot-chicken.jpg",
    },
    {
      _id: "6",
      title: "Roasted Red Pepper Pasta - Ready in 20 Minutes",
      content: "This quick roasted red pepper pasta delivers restaurant-quality flavor in just 20 minutes. The silky sauce combines sweet roasted peppers with cream and parmesan for a luxurious texture without hours of cooking. Perfect for busy weeknights, this recipe proves that delicious, homemade meals don't require extensive preparation or ingredient lists.",
      createdAt: "2024-05-07",
      author: "Marco Rossi",
      category: "Recipe",
      image: "/images/pepper-pasta.jpg",
    },
  ];
  
  // Use placeholder data if no blogs are available
  const displayBlogs = filteredBlogs.length > 0 ? filteredBlogs : placeholderBlogs;

  if (!isMounted) {
    return null; // Prevent hydration errors
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section with Background Image */}
        <div className="relative py-32 overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ 
              backgroundImage: 'url("/images/blog-hero-bg.jpg"), linear-gradient(to right, #2c3e50, #4ca1af)', 
              backgroundPosition: 'center',
              filter: 'brightness(0.7)'
            }}
          ></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-feed-jungle/80 to-feed-black/70 z-10"></div>
          
          {/* Content */}
          <div className="container px-4 mx-auto text-center relative z-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-md">Our Blog</h1>
            <div className="w-24 h-1 bg-feed-lime mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-100 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
              Stay informed with the latest articles on nutrition, healthy eating habits, 
              meal preparation tips, and more.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-12 py-7 rounded-full border-2 border-white/30 bg-white/90 backdrop-blur-sm focus:border-feed-lime focus:bg-white transition-all shadow-lg text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="container px-4 py-12 mx-auto">
          {/* Category Filters with improved styling */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <Filter className="h-5 w-5 text-feed-jungle" />
              <h2 className="text-xl font-semibold text-feed-black">Filter by Category</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedCategory("")}
                variant={selectedCategory === "" ? "default" : "outline"}
                className={`rounded-full px-6 ${selectedCategory === "" ? "bg-feed-jungle hover:bg-feed-jungle/90" : "border-feed-jungle/40 text-feed-jungle hover:bg-feed-jungle/10"}`}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`rounded-full px-6 ${selectedCategory === category ? "bg-feed-jungle hover:bg-feed-jungle/90" : "border-feed-jungle/40 text-feed-jungle hover:bg-feed-jungle/10"}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((index) => (
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
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-20 bg-red-50 rounded-lg">
              <p className="text-red-500 mb-4 font-medium">Failed to load articles</p>
              <Button onClick={() => window.location.reload()} className="bg-feed-jungle hover:bg-feed-jungle/90">
                Try Again
              </Button>
            </div>
          )}

          {/* Articles Grid */}
          {!isLoading && !isError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayBlogs.map((post: BlogType) => (
                <div
                  key={post._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 h-full flex flex-col group"
                >
                  <Link href={`/blog/${post._id}`} className="block overflow-hidden relative">
                    <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
                      {post.image ? (
                        // If there's an image, display it
                        <div 
                          className="h-full w-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500" 
                          style={{ backgroundImage: `url(${post.image})` }}
                        />
                      ) : (
                        // Fallback pattern if no image
                        <div className="h-full w-full bg-gradient-to-r from-feed-jungle/20 to-feed-lime/20 flex items-center justify-center">
                          <span className="text-feed-jungle/50 text-4xl font-bold">feedme</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-feed-jungle text-feed-lime text-xs font-semibold px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </Link>
                  
                  <div className="p-6 flex-1 flex flex-col">
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
                    
                    <h3 className="text-xl font-bold text-feed-black mb-2 line-clamp-2 group-hover:text-feed-jungle transition-colors">
                      <Link href={`/blog/${post._id}`}>{post.title}</Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                      {post.content}
                    </p>
                    
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-600 font-medium">
                        By {post.author}
                      </span>
                      <Link
                        href={`/blog/${post._id}`}
                        className="text-feed-jungle flex items-center text-sm font-medium group-hover:text-feed-lime transition-colors"
                      >
                        Read more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* No Results Message */}
          {filteredBlogs.length === 0 && blogs.length > 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No articles found matching your criteria</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="bg-feed-jungle hover:bg-feed-jungle/90"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 