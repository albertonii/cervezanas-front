"use client";

import { IReview } from "../../../lib/types";
import { IndividualReview } from "./reviews/IndividualReview";
import { ComponentProps } from "react";

interface Props {
  reviews: IReview[];
  handleSetReviews: ComponentProps<any>;
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
