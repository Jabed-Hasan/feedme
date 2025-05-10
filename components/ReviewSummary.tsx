import { Star } from "lucide-react";
import { getMealRating, getReviewCount } from "@/shared/reviewUtils";

interface MealWithReviews {
  ratings?: {
    average: number;
    count: number;
    reviews?: Array<any>;
  };
  rating?: number;
  reviewCount?: number;
}

interface ReviewSummaryProps {
  meal: MealWithReviews;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * A reusable component to display review stars and count
 */
const ReviewSummary = ({
  meal,
  showText = true,
  size = "md",
  className = "",
}: ReviewSummaryProps) => {
  // Get rating and count using utility functions
  const rating = getMealRating(meal);
  const reviewCount = getReviewCount(meal);
  
  // Determine star size based on the size prop
  const starSizeMap = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  const starSize = starSizeMap[size];
  
  // Determine text size based on the size prop
  const textSizeMap = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };
  const textSize = textSizeMap[size];
  
  // Calculate full, half, and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${starSize} fill-yellow-400 text-yellow-400`}
          />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div className={`relative ${starSize}`}>
            <Star className={`absolute ${starSize} text-gray-300`} />
            <Star
              className={`absolute ${starSize} fill-yellow-400 text-yellow-400`}
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${starSize} text-gray-300`} />
        ))}
      </div>
      
      {/* Review count text */}
      {showText && (
        <span className={`ml-1 ${textSize} text-gray-500`}>
          {reviewCount > 0 
            ? `${rating.toFixed(1)} · ${reviewCount}`
            : "No reviews yet"}
        </span>
      )}
    </div>
  );
};

export default ReviewSummary; 