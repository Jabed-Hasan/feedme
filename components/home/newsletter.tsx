"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { useSubscribeMutation } from "@/redux/features/newsletter/newsletterApi";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  
  const [subscribe, { isLoading: isSubmitting }] = useSubscribeMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    try {
      const result = await subscribe({ email }).unwrap();
      
      if (result.status) {
        toast.success(result.message || "Successfully subscribed to newsletter");
        setEmail("");
      } else {
        setError(result.message || "Failed to subscribe. Please try again.");
        toast.error(result.message || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      console.error("Error subscribing to newsletter:", err);
      let errorMessage = "An error occurred. Please try again later.";
      
      // Check if the error has a data property with a message
      if (err && 
          typeof err === 'object' && 
          err !== null && 
          'data' in err && 
          err.data && 
          typeof err.data === 'object' &&
          err.data !== null &&
          'message' in err.data
      ) {
        errorMessage = err.data.message as string;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <section className="py-16 bg-feed-lime/20">
      <div className="container">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-feed-jungle p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-feed-lime">
                Join Our Newsletter
              </h2>
              <p className="text-feed-lime/80 mb-6">
                Subscribe to receive updates on new meal options, nutrition tips, exclusive offers, and more!
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-feed-lime/20 flex items-center justify-center">
                    <span className="text-feed-lime">01</span>
                  </div>
                  <p className="ml-4 text-feed-lime">Weekly healthy eating tips</p>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-feed-lime/20 flex items-center justify-center">
                    <span className="text-feed-lime">02</span>
                  </div>
                  <p className="ml-4 text-feed-lime">Exclusive subscriber discounts</p>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-feed-lime/20 flex items-center justify-center">
                    <span className="text-feed-lime">03</span>
                  </div>
                  <p className="ml-4 text-feed-lime">New meal announcements</p>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-feed-jungle mb-2">
                Sign Up Today
              </h3>
              <p className="text-gray-600 mb-6">
                Be the first to know about our seasonal menus and special promotions
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-feed-jungle/30 focus:border-feed-jungle focus:outline-none"
                    required
                  />
                  {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-feed-jungle text-feed-lime rounded-lg hover:bg-feed-jungle/90 transition-colors ${
                    isSubmitting && "opacity-70 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    "Subscribing..."
                  ) : (
                    <>
                      Subscribe Now <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
              
              <p className="mt-4 text-xs text-gray-500">
                By subscribing, you agree to our Privacy Policy. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 