/**
 * Review utility functions for consistent handling of reviews across the application
 */

interface MealWithReviews {
  ratings?: {
    average: number;
    count: number;
    reviews?: Array<{
      userId: string | { name: string; _id: string };
      rating: number;
      comment: string;
      createdAt: string;
    }>;
  };
  rating?: number;
  reviewCount?: number;
}

/**
 * Get the rating value from a meal object, handling different data structures
 */
export const getMealRating = (meal: MealWithReviews): number => {
  // Check if ratings object exists and has average
  if (meal.ratings?.average !== undefined) {
    return meal.ratings.average;
  }
  
  // Fall back to rating property
  if (meal.rating !== undefined) {
    return meal.rating;
  }
  
  // Default to 0 if no rating found
  return 0;
};

/**
 * Get the review count from a meal object, handling different data structures
 */
export const getReviewCount = (meal: MealWithReviews): number => {
  // Check if ratings object exists and has count
  if (meal.ratings?.count !== undefined) {
    return meal.ratings.count;
  }
  
  // Fall back to reviewCount property
  if (meal.reviewCount !== undefined) {
    return meal.reviewCount;
  }
  
  // Check if ratings has reviews array
  if (meal.ratings?.reviews?.length !== undefined) {
    return meal.ratings.reviews.length;
  }
  
  // Default to 0 if no review count found
  return 0;
};

/**
 * Format the rating display text
 */
export const formatRatingText = (rating: number, count: number): string => {
  if (count === 0) {
    return "No reviews yet";
  }
  
  return `${rating.toFixed(1)} · ${count} ${count === 1 ? 'review' : 'reviews'}`;
};

/**
 * Determine if a meal has reviews
 */
export const hasReviews = (meal: MealWithReviews): boolean => {
  return getReviewCount(meal) > 0;
}; 