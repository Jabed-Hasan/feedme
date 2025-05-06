"use client";

import Link from "next/link";
import { useGetAllMealsQuery } from "@/redux/meal/mealApi";

const Categories = () => {
  // Fetch real data using the same API as the find-meals page
  const { data: mealData, isLoading, isError } = useGetAllMealsQuery({});
  
  // Compute categories based on real API data - keeping only breakfast, lunch and dinner
  const categories = !isLoading && !isError && mealData?.data ? [
    {
      id: 1,
      name: "Breakfast",
      description: "Start your day right with our nutritious breakfast options",
      meals: mealData.data.filter(meal => meal.category === "Breakfast").length,
      bgColor: "#f8d49f", // Breakfast orange/yellow
      icon: "🍳",
    },
    {
      id: 2,
      name: "Lunch",
      description: "Energize your afternoon with balanced lunch meals",
      meals: mealData.data.filter(meal => meal.category === "Lunch").length,
      bgColor: "#a4d4a6", // Lunch green
      icon: "🥗",
    },
    {
      id: 3,
      name: "Dinner",
      description: "Complete your day with our delicious dinner options",
      meals: mealData.data.filter(meal => meal.category === "Dinner").length,
      bgColor: "#c187a8", // Dinner purple/pink
      icon: "🍲",
    }
  ] : [];

  // Skeleton loader for categories
  const CategorySkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 w-full bg-gray-200"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-feed-black">
            Explore Our Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover a variety of meal options tailored to different dietary needs and preferences
          </p>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <CategorySkeleton key={item} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to load meal categories</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-feed-jungle text-feed-lime px-4 py-2 rounded-md hover:bg-feed-jungle/90"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300"
                >
                  {/* Using colored background instead of images */}
                  <div 
                    className="relative h-48 w-full flex items-center justify-center"
                    style={{backgroundColor: category.bgColor}}
                  >
                    <div className="text-center">
                      <span className="text-6xl mb-2 block">{category.icon}</span>
                      <h3 className="text-2xl font-bold text-white drop-shadow-md">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-feed-jungle mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-3">{category.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-feed-jungle font-medium">
                        {category.meals} meals available
                      </span>
                      <Link
                        href={`/find-meals?category=${category.name}`}
                        className="text-feed-lime bg-feed-jungle py-1.5 px-4 rounded-full text-sm font-medium hover:bg-feed-jungle/80 transition-colors active:scale-95"
                      >
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories; 