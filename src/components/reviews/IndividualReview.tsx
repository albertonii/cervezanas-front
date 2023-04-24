import React, { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useTranslation } from "react-i18next";
import { useAuth } from "../Auth/useAuth";
import { Review } from "../../lib/types.d";
import { formatDateString } from "../../utils/formatDate";
import { OwnerInfo } from "..";
import { Rate } from ".";
import { DeleteButton } from "../common";

interface Props {
  review: Review;
  handleSetReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

export function IndividualReview(props: Props) {
  const { t } = useTranslation();
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
      alert(error);
    }
  };

  const handleRead = () => {
    setReadMore(!readMore);
  };

  return (
    <article>
      <OwnerInfo user={review.users} />

      <div className="flex items-center mb-1">
        <div>
          <Rate
            rating={review.overall}
            onRating={() => {}}
            count={5}
            color={starColor}
            editable={false}
          />

          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Compraría otra / No compraría otra
          </h3>
        </div>

        {user?.id === review.owner_id && (
          <div className="flex items-center ml-auto space-x-2">
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
          className="block mb-5 text-sm font-medium text-beer-dark hover:underline dark:text-blue-500 cursor-pointer"
        >
          Read less
        </a>
      ) : (
        <a
          onClick={handleRead}
          className="block mb-5 text-sm font-medium text-beer-dark hover:underline dark:text-blue-500 cursor-pointer"
        >
          Read more
        </a>
      )}

      <aside>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          19 people found this helpful
        </p>
        <div className="flex items-center mt-3 space-x-3 divide-x divide-gray-200 dark:divide-gray-600">
          <a
            href="#"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
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
