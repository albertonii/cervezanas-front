"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "../../Auth/useAuth";
import { IReview } from "../../../../lib/types.d";
import { formatDateString } from "../../../../utils/formatDate";
import { Rate } from ".";
import { DeleteButton } from "../common";
import { useSupabase } from "../../../../context/SupabaseProvider";
import { OwnerInfo } from "../OwnerInfo";

interface Props {
  review: IReview;
  handleSetReviews: React.Dispatch<React.SetStateAction<IReview[]>>;
}

export function IndividualReview(props: Props) {
  const t = useTranslations();
  const { supabase } = useSupabase();
  const { user } = useAuth();

  const [readMore, setReadMore] = useState(false);

  const starColor = { filled: "#fdc300", unfilled: "#a87a12" };

  const { review, handleSetReviews } = props;

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .match({ id: reviewId });
      if (error) throw error;

      handleSetReviews((prev) =>
        prev.filter((review) => review.id !== reviewId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleRead = () => {
    setReadMore(!readMore);
  };

  return (
    <article>
      <OwnerInfo user={review.users} />

      <div className="mb-1 flex items-center">
        <div>
          <Rate
            rating={review.overall}
            onRating={() => void {}}
            count={5}
            color={starColor}
            editable={false}
          />

          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Compraría otra / No compraría otra
          </h3>
        </div>

        {user?.id === review.owner_id && (
          <div className="ml-auto flex items-center space-x-2">
            <DeleteButton onClick={() => handleDeleteReview(review.id)} />
          </div>
        )}
      </div>

      <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        <p>
          {t("reviewed_on")} {formatDateString(review.created_at)}
        </p>
      </footer>

      <p
        className={`mb-2 font-light text-gray-500 dark:text-gray-400 ${
          readMore ? "line-clamp-none" : "line-clamp-3"
        }`}
      >
        {review.comment}
      </p>

      {readMore ? (
        <a
          onClick={handleRead}
          className="mb-5 block cursor-pointer text-sm font-medium text-beer-dark hover:underline dark:text-blue-500"
        >
          Read less
        </a>
      ) : (
        <a
          onClick={handleRead}
          className="mb-5 block cursor-pointer text-sm font-medium text-beer-dark hover:underline dark:text-blue-500"
        >
          Read more
        </a>
      )}

      <aside>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          19 people found this helpful
        </p>
        <div className="mt-3 flex items-center space-x-3 divide-x divide-gray-200 dark:divide-gray-600">
          <a
            href="#"
            className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            Helpful
          </a>
          <a
            href="#"
            className="pl-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Report abuse
          </a>
        </div>
      </aside>
    </article>
  );
}
