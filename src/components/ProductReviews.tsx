import React, { useEffect, useState } from "react";
import { Review } from "../types";
import { supabase } from "../utils/supabaseClient";
import IndividualReview from "./IndividualReview";

interface Props {
  reviews: Review[];
  handleSetReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

export default function ProductReviews({ reviews, handleSetReviews }: Props) {
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
