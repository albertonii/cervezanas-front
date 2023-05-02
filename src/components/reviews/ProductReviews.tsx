import React from "react";
import { IndividualReview } from ".";
import { IReview } from "../../lib/types.d";

interface Props {
  reviews: IReview[];
  handleSetReviews: React.Dispatch<React.SetStateAction<IReview[]>>;
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
