"use client";

import ReviewData from "./ReviewData";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { IReview } from "../../../../../../lib/types";

interface Props {
  reviews: IReview[];
}

export function Reviews({ reviews: r }: Props) {
  console.log(r);
  const t = useTranslations();

  const [reviews, setReviews] = useState<IReview[]>(r);

  const handleSetReviews = (reviewId: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
  };

  return (
    <section className="px-4 py-6 " aria-label="Reviews">
      <span className="flex flex-col space-y-4">
        <h1 className="text-4xl">{t("reviews")}</h1>
      </span>

      {reviews &&
        reviews.length > 0 &&
        reviews.map((review, index) => {
          return (
            <div key={index} className="my-4 rounded-sm bg-beer-foam p-4">
              <ReviewData review={review} handleSetReviews={handleSetReviews} />
            </div>
          );
        })}
    </section>
  );
}
