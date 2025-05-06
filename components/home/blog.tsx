import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "5 Benefits of Meal Prep for Busy Professionals",
      excerpt: "Discover how meal preparation can save you time, money, and help maintain a balanced diet...",
      date: "May 15, 2024",
      readTime: "4 min read",
      author: "Sarah Johnson",
      category: "Nutrition",
      image: "/images/placeholder.jpg",
    },
    {
      id: 2,
      title: "The Ultimate Guide to Balanced Nutrition",
      excerpt: "Learn about macronutrients, micronutrients, and how to create perfectly balanced meals...",
      date: "May 10, 2024",
      readTime: "6 min read",
      author: "Dr. Michael Chen",
      category: "Health",
      image: "/images/placeholder.jpg",
    },
    {
      id: 3,
      title: "Seasonal Ingredients to Add to Your Meals This Summer",
      excerpt: "Explore the freshest summer ingredients and how to incorporate them into your meal plans...",
      date: "May 3, 2024",
      readTime: "5 min read",
      author: "Emma Davis",
      category: "Seasonal",
      image: "/images/placeholder.jpg",
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="relative h-48 w-full bg-gray-200">
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
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-feed-black mb-2 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    By {post.author}
                  </span>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-feed-jungle flex items-center text-sm font-medium hover:text-feed-jungle/80 transition-colors"
                  >
                    Read more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link 
            href="/blog" 
            className="inline-block border-2 border-feed-jungle text-feed-jungle px-8 py-2.5 rounded-full font-medium text-lg hover:bg-feed-jungle hover:text-feed-lime transition-colors"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog; 