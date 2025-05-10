import ReviewCard from "./ReviewCard";
import { Star } from "lucide-react";
import ReviewSummary from "./ReviewSummary";

interface User {
  name: string;
  image?: string;
  email?: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user?: User | string;
  userId?: User | string;
  createdAt: string;
}

interface MealWithReviews {
  ratings?: {
    average: number;
    count: number;
    reviews?: Review[];
  };
  rating?: number;
  reviewCount?: number;
}

interface MealReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  meal?: MealWithReviews; // Optional meal data as fallback
}

const MealReviews = ({ 
  reviews, 
  averageRating, 
  totalReviews, 
  meal 
}: MealReviewsProps) => {
  // Check if we should use the meal's embedded reviews as a fallback
  const hasEmbeddedReviews = meal?.ratings?.reviews && meal.ratings.reviews.length > 0;
  const hasFetchedReviews = reviews && reviews.length > 0;
  
  // Use the appropriate reviews
  const reviewsToShow = hasFetchedReviews 
    ? reviews 
    : (hasEmbeddedReviews ? meal!.ratings!.reviews! : []);
  
  // Use appropriate rating info
  const ratingToShow = hasFetchedReviews 
    ? averageRating 
    : (meal?.ratings?.average || meal?.rating || 0);
    
  const reviewCountToShow = hasFetchedReviews 
    ? totalReviews 
    : (meal?.ratings?.count || meal?.reviewCount || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Customer Reviews</h3>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-medium">{ratingToShow.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-500">
              ({reviewCountToShow} {reviewCountToShow === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviewsToShow.length > 0 ? (
          reviewsToShow.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))
        ) : (
          <p className="text-center text-gray-500">No reviews yet</p>
        )}
      </div>
    </div>
  );
};

export default MealReviews; 