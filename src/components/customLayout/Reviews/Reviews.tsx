import React, { useState } from "react";
import { Review } from "../../../lib/types";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { formatDateString } from "../../../utils";
import { Rate } from "../../reviews";
import Link from "next/link";
import { DeleteButton } from "../../common";
import { supabase } from "../../../utils/supabaseClient";

interface Props {
  reviews: Review[];
}

export function Reviews({ reviews: r }: Props) {
  const { t } = useTranslation();

  const [reviews, setReviews] = useState<Review[]>(r);

  const starColor = { filled: "#fdc300", unfilled: "#a87a12" };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .match({ id: reviewId });
      if (error) throw error;

      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      {reviews &&
        reviews.length > 0 &&
        reviews.map((review, index) => {
          return (
            <div
              key={index}
              className="mt-12 ml-8 bg-beer-foam m-6 p-6 rounded-sm"
            >
              <article className="grid grid-cols-4 md:gap-8 relative">
                {/* Delete review button in top right corner  */}
                <div className="absolute right-0">
                  <DeleteButton onClick={() => handleDeleteReview(review.id)} />
                </div>

                <div className="col-span-4 lg:col-span-1 space-y-6 ">
                  {/* Seller  */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="">
                      <Image
                        className="w-18 h-18 rounded-full"
                        width={80}
                        height={80}
                        src={`${
                          review.users?.avatar_url ?? "/icons/profile-240.png"
                        } `}
                        alt=""
                      />
                    </div>

                    <h2 className="transition-all text-xl truncate ">
                      {t("seller_username")}:{" "}
                      <Link
                        className="font-bold text-beer-draft hover:text-purple-500 hover:text-beer-blonde cursor-pointer"
                        href={`/users/${review.users?.id}`}
                      >
                        {review.users?.username}
                      </Link>
                    </h2>
                  </div>
                </div>

                {/* Review rate */}
                <div className="col-span-4 lg:col-span-3 mt-6 md:mt-0">
                  <div className="flex flex-col-reverse md:flex-row tems-start md:items-center justify-between">
                    <div className="space-y-2">
                      {/* Img Product  */}
                      <div className="flex flex-row items-center space-y-4 space-x-4">
                        <Image
                          className="w-20 h-20 sm:w-100 sm:h-100 rounded"
                          width={80}
                          height={80}
                          src={`${
                            review.products?.product_multimedia[0]
                              .p_principal ?? "/icons/beer-240.png"
                          } `}
                          alt=""
                        />

                        <span className="font-bold transition-all text-xl mr-auto cursor-pointer text-beer-draft dark:text-beer-foam hover:text-purple-500 truncate hover:text-beer-blonde">
                          <Link href={`/products/${review.products?.id}`}>
                            {review.products?.name}
                          </Link>
                        </span>
                      </div>

                      <footer>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          {t("reviewed")}:{" "}
                          <time dateTime="2022-01-20 19:00">
                            {formatDateString(review.created_at)}
                          </time>
                        </p>
                      </footer>
                    </div>

                    <div className="flex space-x-2">
                      <Rate
                        rating={review.overall}
                        onRating={() => {}}
                        count={review.overall}
                        color={starColor}
                        editable={false}
                      />

                      <p className="bg-beer-blonde text-white text-sm font-semibold inline-flex items-center p-1.5 rounded">
                        {review.overall} / 5
                      </p>
                    </div>
                  </div>

                  <p className="font-medium text-md text-beer-dark dark:text-gray-400">
                    {review.comment}
                  </p>

                  {/* Stars  */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-9">
                    <div className="w-full text-md ">
                      <label htmlFor="aroma">{t("aroma")}</label>

                      <Rate
                        rating={review.aroma}
                        count={5}
                        color={starColor}
                        editable={false}
                      />
                    </div>

                    <div className="w-full text-md mb-4">
                      <label htmlFor="appearance">{t("appearance")}</label>
                      <Rate
                        rating={review.appearance}
                        count={5}
                        color={starColor}
                        editable={false}
                      />
                    </div>

                    <div className="w-full text-md mb-4">
                      <label htmlFor="taste">{t("taste")}</label>
                      <Rate
                        rating={review.taste}
                        count={5}
                        color={starColor}
                        editable={false}
                      />
                    </div>

                    <div className="w-full text-md mb-4">
                      <label htmlFor="mouthfeel">{t("mouthfeel")}</label>
                      <Rate
                        rating={review.mouthfeel}
                        count={5}
                        color={starColor}
                        editable={false}
                      />
                    </div>

                    <div className="w-full text-md mb-4">
                      <label htmlFor="bitterness">{t("bitterness")}</label>
                      <Rate
                        rating={review.bitterness}
                        count={5}
                        color={starColor}
                        editable={false}
                      />
                    </div>

                    <div className="w-full text-md mb-4">
                      <label htmlFor="overall">{t("overall")}</label>
                      <Rate
                        rating={review.overall}
                        count={5}
                        color={starColor}
                        editable={true}
                      />
                    </div>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
    </>
  );
}
