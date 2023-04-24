import React from "react";
import { IndividualReview } from ".";
import { Review } from "../../lib/types.d";

interface Props {
  reviews: Review[];
  handleSetReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

export function ProductReviews({ reviews, handleSetReviews }: Props) {
  return (
    <div>
      {reviews.map((review) => (
        <div key={review.id} className="mb-8">
          <IndividualReview
            review={review}
            handleSetReviews={handleSetReviews}
          />
        </div>
      ))}
    </div>
  );
}
