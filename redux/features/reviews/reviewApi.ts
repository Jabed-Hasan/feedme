import { baseApi } from "@/redux/api/baseApi";

interface User {
  _id: string;
  name: string;
  image?: string;
  email?: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user?: User;
  userId?: User | string;
  createdAt: string;
}

interface ReviewsResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
  };
}

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMealReviews: builder.query<ReviewsResponse, string>({
      query: (mealId) => ({
        url: `/reviews/meal/${mealId}`,
        method: "GET",
      }),
      transformResponse: (response: ReviewsResponse) => {
        if (!response || !response.data) {
          return {
            status: false,
            statusCode: 404,
            message: "No reviews found",
            data: {
              reviews: [],
              averageRating: 0,
              totalReviews: 0,
            },
          };
        }
        
        // Transform reviews to ensure user info is properly structured
        if (response.data.reviews) {
          response.data.reviews = response.data.reviews.map(review => {
            // If review has userId object instead of user object, normalize it
            if (!review.user && review.userId && typeof review.userId === 'object') {
              review.user = review.userId;
            }
            
            // Make sure dates are properly formatted
            if (review.createdAt) {
              try {
                // Test if the date is valid
                const date = new Date(review.createdAt);
                if (isNaN(date.getTime())) {
                  // If date is invalid, set it to current date
                  review.createdAt = new Date().toISOString();
                }
              } catch (e) {
                // Handle date parsing errors
                review.createdAt = new Date().toISOString();
              }
            } else {
              // If no createdAt, add current date
              review.createdAt = new Date().toISOString();
            }
            
            return review;
          });
        }
        
        return response;
      },
      providesTags: ["Reviews"],
    }),

    submitReview: builder.mutation<
      ReviewsResponse,
      {
        mealId: string;
        rating: number;
        comment: string;
      }
    >({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const { useGetMealReviewsQuery, useSubmitReviewMutation } = reviewApi; 