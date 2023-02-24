import React from "react";
import { Review } from "../../../lib/types";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { formatDateString } from "../../../utils";
import { Rate } from "../../reviews";
import Link from "next/link";

interface Props {
  reviews: Review[];
}

export function Reviews({ reviews }: Props) {
  const { t } = useTranslation();

  const starColor = { filled: "#fdc300", unfilled: "#a87a12" };

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
              <article className="grid grid-cols-4 md:gap-8 ">
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

                  <aside className="flex items-center mt-3 space-x-5">
                    <a
                      href="#"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 mr-1.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                      </svg>
                      Helpful
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 group"
                    >
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 mr-1.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"></path>
                      </svg>
                      Not helpful
                    </a>
                  </aside>
                </div>
              </article>
            </div>
          );
        })}
    </>
  );
}
