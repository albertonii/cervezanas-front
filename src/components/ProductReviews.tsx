import { Button } from "@supabase/ui";
import React from "react";
import { supabase } from "../utils/supabaseClient";
import OwnerInfo from "./OwnerInfo";
import Rate from "./Rate";

interface Props {
  reviews: any[];
}

export default function ProductReviews({ reviews }: Props) {
  const starColor = { filled: "#fdc300", unfilled: "#a87a12" };
  const [readMore, setReadMore] = React.useState(false);

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from("review")
        .delete()
        .match({ id: reviewId });
      if (error) throw error;
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      {reviews.map((review) => (
        <div key={review.id} className="mb-8">
          <article>
            <OwnerInfo ownerId={review.owner_id} />

            <div className="flex items-center mb-1">
              <div>
                <Rate
                  rating={review.overall}
                  onRating={() => {}}
                  count={5}
                  color={starColor}
                  editable={false}
                />

                <h3 className="ml-2 text-sm font-semibold text-gray-900 dark:text-white">
                  Thinking to buy another one!
                </h3>
              </div>

              <div className="flex items-center ml-auto space-x-2">
                <Button
                  type="primary"
                  danger
                  onClick={() => handleDeleteReview(review.id)}
                >
                  Delete
                </Button>
              </div>
            </div>

            <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              <p>
                Reviewed in the United Kingdom on{" "}
                <time dateTime="2017-03-03 19:00">March 3, 2017</time>
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
                onClick={() => {
                  setReadMore(false);
                }}
                className="block mb-5 text-sm font-medium text-beer-dark hover:underline dark:text-blue-500 cursor-pointer"
              >
                Read less
              </a>
            ) : (
              <a
                onClick={() => {
                  setReadMore(true);
                }}
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
        </div>
      ))}
    </div>
  );
}
