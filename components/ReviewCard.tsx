import { Star } from "lucide-react";
import { Card } from "./ui/card";
import Image from "next/image";

interface ReviewUser {
  name: string;
  image?: string;
  email?: string;
}

interface ReviewCardProps {
  review: {
    rating: number;
    comment: string;
    user?: ReviewUser | string;
    userId?: ReviewUser | string;
    createdAt: string;
    _id?: string;
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  // Process user data to handle different formats
  let userName = "Customer";
  let userImage = undefined;
  let userInitials = "C";

  // Handle different user data formats to get real name
  if (review.user && typeof review.user === 'object' && review.user.name) {
    // If review.user is a proper object with name
    userName = review.user.name;
    userImage = review.user.image;
    userInitials = userName.substring(0, 1).toUpperCase();
  } else if (review.userId && typeof review.userId === 'object' && review.userId.name) {
    // If userId contains user data with name
    userName = review.userId.name;
    userImage = review.userId.image;
    userInitials = userName.substring(0, 1).toUpperCase();
  } else if (typeof review.user === 'string') {
    // If user is just a string ID
    userName = `Customer ${review.user.substring(0, 4)}`;
    userInitials = review.user.substring(0, 1).toUpperCase();
  } else if (typeof review.userId === 'string') {
    // If userId is just a string ID
    userName = `Customer ${review.userId.substring(0, 4)}`;
    userInitials = review.userId.substring(0, 1).toUpperCase();
  } else if (review._id) {
    // Fallback to review ID if no user info
    userName = `Customer ${review._id.substring(0, 4)}`;
    userInitials = review._id.substring(0, 1).toUpperCase();
  }

  // Format date properly with fallback
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Recently";
      }
      
      // Format the date
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "Recently";
    }
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          {userImage ? (
            <Image
              src={userImage}
              alt={userName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-lg font-medium text-gray-600">
                {userInitials}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{userName}</h4>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard; 