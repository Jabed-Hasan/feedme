"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllMealsQuery } from "@/redux/meal/mealApi";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  Search,
  ChefHat,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import ReviewSummary from "@/components/ReviewSummary";

// Define interface for meal object
interface Meal {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  providerId: string | { name?: string; _id?: string; email?: string };
  ratings?: { average: number; count: number };
  rating?: number;
  reviewCount?: number;
  preferences?: string[];
}

export default function FindMealsPage() {
  // const router = useRouter();
  const { data: mealData, isLoading, isError } = useGetAllMealsQuery({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [preferenceSearchTerm, setPreferenceSearchTerm] = useState("");
  const [providerSearchTerm, setProviderSearchTerm] = useState("");
  // New pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 8;
  // State for mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get all unique providers from the data
  const providers = mealData?.data
    ? Array.from(
        new Set(
          mealData.data.map((meal) =>
            typeof meal.providerId === "object" && meal.providerId?.name
              ? meal.providerId.name
              : typeof meal.providerId === "string"
                ? meal.providerId
                : "Unknown Provider",
          ),
        ),
      )
    : [];

  // Common meal preferences
  const preferences = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Low-Carb",
    "Keto",
  ];

  // Filter preferences and providers based on search terms
  const filteredPreferences = preferences.filter((pref) =>
    pref.toLowerCase().includes(preferenceSearchTerm.toLowerCase()),
  );

  const filteredProviders = providers.filter((provider) =>
    provider.toLowerCase().includes(providerSearchTerm.toLowerCase()),
  );

  // Filter meals based on all criteria
  const filteredMeals =
    mealData?.data?.filter((meal) => {
      const matchesSearch =
        searchTerm === "" ||
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory || meal.category === selectedCategory;

      const rating = meal.ratings?.average ?? meal.rating ?? 0;
      const matchesRating = rating >= minRating;

      const providerName =
        typeof meal.providerId === "object" && meal.providerId?.name
          ? meal.providerId.name
          : typeof meal.providerId === "string"
            ? meal.providerId
            : "Unknown Provider";
      const matchesProvider =
        selectedProviders.length === 0 ||
        selectedProviders.includes(providerName);

      // This is mocked since we don't have preferences in the data model yet
      // In a real implementation, you would check meal.preferences or similar field
      const mealPreferences = meal.preferences || [];
      const matchesPreferences =
        selectedPreferences.length === 0 ||
        selectedPreferences.some(
          (pref) =>
            meal.description.toLowerCase().includes(pref.toLowerCase()) ||
            mealPreferences.includes(pref),
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesRating &&
        matchesProvider &&
        matchesPreferences
      );
    }) || [];

  // Pagination calculations
  const totalPages = Math.ceil(filteredMeals.length / mealsPerPage);
  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = filteredMeals.slice(indexOfFirstMeal, indexOfLastMeal);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCategory,
    minRating,
    selectedProviders,
    selectedPreferences,
  ]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // const handleMealSelect = (mealId: string) => {
  //   router.push(`/order/${mealId}`);
  // };

  const handleProviderToggle = (provider: string) => {
    setSelectedProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider],
    );
  };

  const handlePreferenceToggle = (preference: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference],
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setMinRating(0);
    setSelectedProviders([]);
    setSelectedPreferences([]);
    setCurrentPage(1);
  };

  const renderRating = (meal: Meal) => {
    return <ReviewSummary meal={meal} size="md" />;
  };

  // Pagination UI component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];

    // Show at most 5 page numbers with current page in the middle when possible
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    // Adjust startPage if endPage is at the maximum
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="mt-8 flex items-center justify-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(1)}
              className="h-9 w-9"
            >
              1
            </Button>
            {startPage > 2 && <span className="mx-1">...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <Button
            key={number}
            variant={currentPage === number ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(number)}
            className="h-9 w-9"
          >
            {number}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="mx-1">...</span>}
            <Button
              variant={currentPage === totalPages ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              className="h-9 w-9"
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Find Meals</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="mb-4 text-3xl font-bold">Error Loading Meals</h1>
        <p className="mb-6 text-gray-600">
          We are having trouble loading the available meals. Please try again
          later.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // Sidebar component for filters
  const FiltersSidebar = () => (
    <div className="h-full flex-shrink-0 overflow-y-auto rounded-md border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={() => setSidebarOpen(false)}
          className="rounded-full p-1 hover:bg-gray-100 md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Search input */}
      <div className="relative mb-6">
        <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search meals..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Section */}
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-medium">Category</h4>
        <div className="flex flex-col space-y-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="justify-start"
          >
            All
          </Button>
          <Button
            variant={selectedCategory === "Breakfast" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("Breakfast")}
            className="justify-start"
          >
            Breakfast
          </Button>
          <Button
            variant={selectedCategory === "Lunch" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("Lunch")}
            className="justify-start"
          >
            Lunch
          </Button>
          <Button
            variant={selectedCategory === "Dinner" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("Dinner")}
            className="justify-start"
          >
            Dinner
          </Button>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-medium">Minimum Rating</h4>
        <div className="flex w-full flex-col space-y-4">
          <div className="relative flex w-full items-center">
            <Slider
              value={[minRating]}
              min={0}
              max={5}
              step={1}
              onValueChange={(values) => setMinRating(values[0])}
              className="w-full"
            />
            <div className="absolute -top-3 right-0 left-0 flex justify-between">
              {[0, 1, 2, 3, 4, 5].map((value) => (
                <div
                  key={value}
                  className={`${minRating >= value ? "bg-black" : "bg-gray-200"}`}
                  style={{
                    height:
                      value === 0 || value === 5
                        ? "10px"
                        : value % 2 === 0
                          ? "8px"
                          : "6px",
                    width: value === 0 || value === 5 ? "2px" : "1px",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{minRating}</span>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Dietary Preferences */}
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-medium">Dietary Preferences</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex w-full items-center gap-1 px-3"
            >
              {selectedPreferences.length > 0
                ? `${selectedPreferences.length} selected`
                : "Select preferences"}
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[240px]">
            <DropdownMenuLabel>Dietary Preferences</DropdownMenuLabel>
            <div className="px-2 py-1.5">
              <div className="relative">
                <Search className="absolute top-2.5 left-2 h-3.5 w-3.5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search preferences..."
                  className="h-8 pl-7 text-sm"
                  value={preferenceSearchTerm}
                  onChange={(e) => setPreferenceSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-[200px] overflow-auto">
              {filteredPreferences.length > 0 ? (
                filteredPreferences.map((preference) => (
                  <DropdownMenuCheckboxItem
                    key={preference}
                    checked={selectedPreferences.includes(preference)}
                    onCheckedChange={() => handlePreferenceToggle(preference)}
                  >
                    {preference}
                  </DropdownMenuCheckboxItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-center text-sm text-gray-500">
                  No preferences found
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Meal Providers */}
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-medium">Meal Providers</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex w-full items-center gap-1 px-3"
            >
              {selectedProviders.length > 0
                ? `${selectedProviders.length} selected`
                : "Select providers"}
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[240px]">
            <DropdownMenuLabel>Meal Providers</DropdownMenuLabel>
            <div className="px-2 py-1.5">
              <div className="relative">
                <Search className="absolute top-2.5 left-2 h-3.5 w-3.5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search providers..."
                  className="h-8 pl-7 text-sm"
                  value={providerSearchTerm}
                  onChange={(e) => setProviderSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-[200px] overflow-auto">
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => (
                  <DropdownMenuCheckboxItem
                    key={provider}
                    checked={selectedProviders.includes(provider)}
                    onCheckedChange={() => handleProviderToggle(provider)}
                  >
                    {provider}
                  </DropdownMenuCheckboxItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-center text-sm text-gray-500">
                  No providers found
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Reset Button */}
      <Button
        variant="default"
        size="sm"
        onClick={resetFilters}
        className="bg-primary hover:bg-primary/90 w-full text-white"
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Find Meals</h1>
        
        {/* Mobile filter toggle button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main layout with sidebar and content */}
      <div className="flex flex-row gap-6">
        {/* Sidebar for desktop and mobile (with different CSS) */}
        <div 
          className={`${sidebarOpen ? 'fixed inset-y-0 right-0 z-50 w-80' : 'hidden'} md:static md:block md:w-64`}
        >
          <FiltersSidebar />
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              {filteredMeals.length} {filteredMeals.length === 1 ? "meal" : "meals"}{" "}
              found
              {filteredMeals.length > 0
                ? ` (showing ${indexOfFirstMeal + 1}-${Math.min(indexOfLastMeal, filteredMeals.length)} of ${filteredMeals.length})`
                : ""}
            </p>
          </div>

          {/* Meals grid */}
          {filteredMeals.length === 0 ? (
            <div className="py-12 text-center">
              <h2 className="mb-4 text-xl font-medium">No meals found</h2>
              <p className="mb-6 text-gray-500">
                Try adjusting your search or filters
              </p>
              <Button onClick={resetFilters}>Show All Meals</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {currentMeals.map((meal) => (
                  <Link
                    href={`/order/${meal._id}`}
                    key={meal._id}
                    className="hover:shadow-feed-jungle/20 cursor-pointer overflow-hidden rounded-2xl bg-white p-4 shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={meal.image}
                        alt={meal.name}
                        fill
                        className="rounded-lg object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <Badge
                        className="bg-feed-lime absolute top-2 right-2 h-6 rounded-full text-base text-black"
                        variant="secondary"
                      >
                        {meal.category}
                      </Badge>
                    </div>
                    <div className="py-3">
                      <div className="mb-1 flex items-center justify-between">
                        <h3 className="truncate text-lg font-semibold">
                          {meal.name}
                        </h3>
                        <span className="text-feed-jungle/70 text-lg font-semibold">
                          ৳{meal.price.toFixed(2)}
                        </span>
                      </div>

                      <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                        {meal.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <ChefHat className="h-4 w-4" />
                          <span className="truncate max-w-[100px]">
                            {typeof meal.providerId === "object" &&
                            meal.providerId?.name
                              ? meal.providerId.name
                              : typeof meal.providerId === "string"
                                ? meal.providerId
                                : "Unknown Provider"}
                          </span>
                        </div>
                        {renderRating(meal)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination controls */}
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
