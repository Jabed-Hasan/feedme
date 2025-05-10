"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Share2, Heart, MessageSquare, Bookmark, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetBlogByIdQuery, useGetAllBlogsQuery } from "@/redux/features/blogs/blogApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

export default function BlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;
  
  // State for scroll-to-top and other interactive elements
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Detect scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Fetch blog data
  const { data: blogData, isLoading, isError } = useGetBlogByIdQuery(blogId);
  const blog = blogData?.data;
  
  // Fetch all blogs for related posts
  const { data: allBlogsData } = useGetAllBlogsQuery({});
  
  // Format the date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Estimate read time based on content length (approximately 200 words per minute)
  const getReadTime = (content: string) => {
    if (!content) return "1 min read";
    const words = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / 200);
    return `${readTime} min read`;
  };
  
  // Handle share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title || "FeedMe Blog Article",
        text: "Check out this interesting article!",
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  // If no real blog data is available yet, use sample data
  const placeholderBlog = {
    _id: blogId,
    title: "5 Benefits of Meal Prep for Busy Professionals",
    content: `
      <p>Meal preparation, commonly known as meal prep, has gained significant popularity in recent years, especially among busy professionals juggling demanding careers and personal lives. This practice involves planning, preparing, and packaging meals ahead of time, typically for the upcoming week.</p>
      
      <h2>Time Efficiency</h2>
      <p>One of the most significant benefits of meal prep is time savings. By dedicating a few hours on the weekend to prepare meals for the week, you eliminate the daily decision-making process about what to eat and the time spent cooking each day. This efficiency is particularly valuable for professionals with packed schedules.</p>
      
      <h2>Cost Effectiveness</h2>
      <p>Meal prepping allows you to buy ingredients in bulk, reducing the cost per meal. Additionally, having prepared meals readily available decreases the temptation to order takeout or dine out, which can be considerably more expensive over time.</p>
      
      <h2>Nutritional Control</h2>
      <p>When you prepare your meals, you have complete control over the ingredients and portions. This control makes it easier to adhere to specific dietary requirements or nutritional goals, whether you're focusing on protein intake, reducing carbohydrates, or managing calorie consumption.</p>
      
      <h2>Stress Reduction</h2>
      <p>Eliminating the daily stress of deciding what to eat and finding time to cook can significantly reduce overall stress levels. Having meals ready to grab can provide peace of mind and create a more relaxed approach to daily nutrition.</p>
      
      <h2>Consistency in Diet</h2>
      <p>Meal prep promotes consistency in your diet, which is crucial for achieving and maintaining health and fitness goals. It helps prevent impulsive food choices that might not align with your nutritional objectives.</p>
      
      <h2>Getting Started with Meal Prep</h2>
      <p>If you're new to meal prepping, start small. Begin with preparing just a few meals for the week, such as breakfasts or lunches, and gradually increase as you become more comfortable with the process. Invest in quality food storage containers, plan your meals based on your schedule for the week, and consider the shelf life of different foods when planning.</p>
      
      <p>Meal prep isn't just a trend; it's a practical approach to nutrition that offers numerous benefits for busy professionals. By investing a little time upfront, you can save time, money, and stress throughout the week while maintaining a consistent, healthy diet.</p>
    `,
    createdAt: "2024-05-15",
    author: "Sarah Johnson",
    authorTitle: "Nutrition Specialist",
    authorImage: "/images/avatars/sarah.jpg",
    category: "Nutrition",
    image: "/images/meal-prep.jpg",
    relatedPosts: [
      { id: "2", title: "The Ultimate Guide to Balanced Nutrition", image: "/images/balanced-nutrition.jpg" },
      { id: "3", title: "Seasonal Ingredients to Add to Your Meals This Summer", image: "/images/summer-ingredients.jpg" }
    ]
  };
  
  // Use placeholder data if no blog is available and not loading
  const displayBlog = blog || (!isLoading && placeholderBlog);

  // Function to render HTML content safely
  const renderHTML = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  // Function to generate related posts
  const getRelatedPosts = () => {
    if (!allBlogsData?.data || allBlogsData.data.length === 0) {
      // Fallback to placeholder data if no real data is available
      return [
        { id: "2", title: "The Ultimate Guide to Balanced Nutrition", image: "/images/balanced-nutrition.jpg", category: "Nutrition" },
        { id: "3", title: "Seasonal Ingredients to Add to Your Meals This Summer", image: "/images/summer-ingredients.jpg", category: "Seasonal" }
      ];
    }

    // Filter out the current blog
    const otherBlogs = allBlogsData.data.filter(relatedBlog => relatedBlog._id !== blogId);
    
    // If there are related posts from the same category, prioritize them
    const sameCategoryBlogs = otherBlogs.filter(relatedBlog => 
      relatedBlog.category === blog?.category || 
      relatedBlog.category === displayBlog.category
    );
    
    // Get up to 2 blogs from the same category, or random blogs if not enough
    let relatedBlogs = sameCategoryBlogs.slice(0, 2);
    
    // If we don't have enough from the same category, add some random ones
    if (relatedBlogs.length < 2) {
      const randomBlogs = otherBlogs
        .filter(b => !relatedBlogs.some(rb => rb._id === b._id))
        .slice(0, 2 - relatedBlogs.length);
      
      relatedBlogs = [...relatedBlogs, ...randomBlogs];
    }
    
    // Format the blogs to match our expected structure
    return relatedBlogs.map(relatedBlog => ({
      id: relatedBlog._id,
      title: relatedBlog.title,
      image: relatedBlog.image || "/images/default-blog.jpg",
      category: relatedBlog.category || "" // Ensure category is always defined
    })).slice(0, 2); // Ensure we have at most 2 blogs
  };

  // Get suggested reads from API data or fallback to placeholders
  const suggestedReads = getRelatedPosts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-feed-jungle"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Failed to load article</h1>
        <p className="text-gray-600 mb-6">We couldn&apos;t find the article you&apos;re looking for.</p>
        <Button onClick={() => router.push('/blog')}>Back to All Articles</Button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Back button and action buttons */}
          <div className="flex justify-between items-center mb-8 max-w-3xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center hover:bg-gray-100"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
                onClick={() => setIsLiked(!isLiked)}
                aria-label="Like article"
              >
                <Heart className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${isBookmarked ? 'text-feed-jungle hover:text-feed-jungle/90' : 'hover:text-feed-jungle'}`}
                onClick={() => setIsBookmarked(!isBookmarked)}
                aria-label="Bookmark article"
              >
                <Bookmark className="h-5 w-5" fill={isBookmarked ? 'currentColor' : 'none'} />
              </Button>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100"
                  onClick={handleShare}
                  aria-label="Share article"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                {showShareTooltip && (
                  <div className="absolute -bottom-10 right-0 bg-black text-white text-xs py-1 px-3 rounded-md whitespace-nowrap">
                    Link copied!
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Article Header */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Link 
                href={`/blog?category=${displayBlog.category}`}
                className="bg-feed-jungle text-feed-lime text-xs font-semibold px-3 py-1 rounded-full hover:bg-feed-jungle/90 transition-colors"
              >
                {displayBlog.category}
              </Link>
            </div>
            
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-feed-black leading-tight mb-6">
                {displayBlog.title}
              </h1>
              
              <div className="flex items-center gap-4">
                {/* Author information - clean design */}
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 border-2 border-feed-lime">
                    <AvatarImage src={displayBlog.authorImage || "/images/avatars/default.jpg"} alt={displayBlog.author} />
                    <AvatarFallback>{displayBlog.author?.charAt(0) || "A"}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="font-medium text-feed-black">{displayBlog.author}</p>
                    <p className="text-xs text-gray-500">{displayBlog.authorTitle || "Author"}</p>
                  </div>
                </div>
                
                <div className="h-6 border-l border-gray-300"></div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-feed-jungle" />
                  <span className="text-sm text-gray-600">{formatDate(displayBlog.createdAt)}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-feed-jungle" />
                  <span className="text-sm text-gray-600">{getReadTime(displayBlog.content)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured Image with caption */}
          {displayBlog.image && (
            <div className="max-w-4xl mx-auto mb-10">
              <figure className="overflow-hidden rounded-2xl shadow-lg">
                <div 
                  className="w-full h-[300px] md:h-[450px] lg:h-[550px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${displayBlog.image})` }}
                />
                <figcaption className="text-center text-sm text-gray-500 py-2 px-4 bg-gray-50 italic">
                  {displayBlog.imageCaption || `Image related to ${displayBlog.title}`}
                </figcaption>
              </figure>
            </div>
          )}
          
          {/* Article Content with improved typography */}
          <div className="max-w-3xl mx-auto mb-14">
            <div className="bg-white p-6 md:p-10 rounded-xl shadow-sm">
              {typeof displayBlog.content === 'string' && displayBlog.content.includes('<') ? (
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-feed-black prose-headings:font-semibold prose-a:text-feed-jungle prose-strong:text-feed-black prose-strong:font-semibold prose-p:text-gray-700 prose-li:text-gray-700 prose-p:leading-relaxed prose-img:rounded-lg prose-h2:mt-10 prose-h2:mb-4 prose-p:mb-6"
                  dangerouslySetInnerHTML={renderHTML(displayBlog.content)} 
                />
              ) : (
                <div className="prose prose-lg max-w-none prose-headings:text-feed-black prose-a:text-feed-jungle">
                  <p className="text-gray-700 leading-relaxed mb-6">{displayBlog.content}</p>
                </div>
              )}
              
              {/* Article footer - tags, share options */}
              <div className="border-t border-gray-100 mt-12 pt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full ${isLiked ? 'text-red-500 border-red-200 bg-red-50' : 'hover:bg-red-50'}`}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className="mr-1 h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} />
                    Like
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full hover:bg-blue-50"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full ${isBookmarked ? 'text-feed-jungle border-feed-jungle/30 bg-feed-lime/10' : 'hover:bg-feed-lime/10'}`}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    <Bookmark className="mr-1 h-4 w-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                    Save
                  </Button>
                </div>
                
                <Link href="/contact" className="text-feed-jungle hover:underline text-sm font-medium group transition-colors">
                  <MessageSquare className="inline-block mr-1 h-4 w-4 group-hover:text-feed-lime transition-colors" />
                  Have questions? Contact us
                </Link>
              </div>
            </div>
          </div>
          
          {/* Suggested Reads Section with improved design */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-feed-black mb-8 text-center">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {suggestedReads.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/blog/${post.id}`}
                  className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col h-full">
                    <div 
                      className="w-full h-48 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${post.image})` }}
                    />
                    <div className="p-6 flex flex-col flex-grow">
                      {post.category && post.category.length > 0 && (
                        <span className="inline-block bg-feed-lime/30 text-feed-jungle text-xs px-2.5 py-1 rounded-full mb-3">
                          {post.category}
                        </span>
                      )}
                      <h3 className="font-semibold text-lg text-feed-black group-hover:text-feed-jungle transition-colors mb-3">
                        {post.title}
                      </h3>
                      <div className="mt-auto pt-4 flex items-center text-feed-jungle font-medium text-sm">
                        Read article 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-feed-jungle to-feed-jungle/80 rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-2xl font-bold mb-4">Ready to transform your meal experience?</h2>
            <p className="mb-6 opacity-90">Join thousands of satisfied customers enjoying fresh, customized meals.</p>
            <Button 
              className="bg-feed-lime text-feed-jungle hover:bg-white transition-colors"
              onClick={() => router.push('/find-meals')}
            >
              Find Your Perfect Meals
            </Button>
          </div>
        </div>
        
        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-feed-jungle text-white shadow-lg transition-all hover:bg-feed-jungle/90"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </button>
        )}
      </main>
      <Footer />
    </>
  );
} 