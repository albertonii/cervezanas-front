import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BeerEnum } from "../lib/beerEnum";
import { Review } from "../types";

interface Props {
  reviews: Review[];
  emptyReviews: boolean;
}

export default function ProductOverallReview({ reviews, emptyReviews }: Props) {
  const { t } = useTranslation();

  const [loading, setLoading] = React.useState(false);

  const [aroma, setAroma] = React.useState(0);
  const [appearance, setAppearance] = React.useState(0);
  const [taste, setTaste] = React.useState(0);
  const [mouthfeel, setMouthfeel] = React.useState(0);
  const [bitterness, setBitterness] = React.useState(0);
  const [overall, setOverall] = React.useState(0);
  const [qualification, setQualification] = React.useState(
    BeerEnum.ReviewQualification.not_qualified
  );

  useEffect(() => {
    let { aroma, appearance, taste, mouthfeel, bitterness, overall } =
      reviews.reduce(
        (acc, review) => {
          acc.aroma += review.aroma;
          acc.appearance += review.appearance;
          acc.taste += review.taste;
          acc.mouthfeel += review.mouthfeel;
          acc.bitterness += review.bitterness;
          return acc;
        },
        {
          aroma: 0,
          appearance: 0,
          taste: 0,
          mouthfeel: 0,
          bitterness: 0,
          overall: 0,
        }
      );

    aroma = aroma / reviews.length;
    appearance = appearance / reviews.length;
    taste = taste / reviews.length;
    mouthfeel = mouthfeel / reviews.length;
    bitterness = bitterness / reviews.length;
    overall = (aroma + appearance + taste + mouthfeel + bitterness) / 5;

    setAroma(aroma);
    setAppearance(appearance);
    setTaste(taste);
    setMouthfeel(mouthfeel);
    setBitterness(bitterness);
    setOverall(overall);

    setQualificationReview(overall);

    setLoading(true);
  }, [reviews]);

  function setQualificationReview(overall: number) {
    switch (true) {
      case overall < 2:
        setQualification(BeerEnum.ReviewQualification.need_to_improve);
        break;
      case overall < 3:
        setQualification(BeerEnum.ReviewQualification.fair);
        break;
      case overall < 4:
        setQualification(BeerEnum.ReviewQualification.good);
        break;
      case overall < 4.7:
        setQualification(BeerEnum.ReviewQualification.very_good);
        break;
      case overall < 5:
        setQualification(BeerEnum.ReviewQualification.excellent);
        break;
      case overall === 5:
        setQualification(BeerEnum.ReviewQualification.superb);
        break;
    }
  }

  const getPercentage = (number: number) => {
    if (isNaN(number)) return "0%";
    const percentage = (number / 5) * 100;
    return `${percentage}%`;
  };

  return (
    <>
      {loading && (
        <section>
          <div className="flex items-center mb-5">
            <p className="bg-blue-100 text-beer-blonde text-lg font-semibold inline-flex items-center p-1.5 rounded dark:bg-blue-200 dark:text-blue-800">
              {!emptyReviews ? overall.toFixed(1) : 0}
            </p>
            <p
              className={`ml-2 font-medium text-gray-900 dark:text-white ${
                qualification == BeerEnum.ReviewQualification.superb &&
                !emptyReviews
                  ? "text-2xl animate-bounce text-transparent bg-gradient-to-r to-beer-blonde from-beer-dark bg-clip-text"
                  : ""
              }`}
            >
              {!emptyReviews ? t(qualification) : t("not_qualified")}
            </p>
            <span className="w-1 h-1 mx-2 bg-gray-900 rounded-full dark:bg-gray-500"></span>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {reviews.length} {t("reviews")}
            </p>

            {!emptyReviews && (
              <a
                href="#"
                className="ml-auto text-sm font-medium text-beer-dark hover:underline dark:text-blue-500"
              >
                {t("read_all_reviews")}
              </a>
            )}
          </div>

          <div className="gap-8 sm:grid sm:grid-cols-2">
            <div>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("aroma")}
                </dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div
                      className={`bg-beer-blonde h-2.5 rounded dark:bg-blue-500 `}
                      style={{
                        width: `${getPercentage(aroma)}`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {!emptyReviews && aroma.toFixed(1)}
                  </span>
                </dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("appearance")}
                </dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div
                      className={`bg-beer-blonde h-2.5 rounded dark:bg-blue-500 `}
                      style={{
                        width: `${getPercentage(appearance)}`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {!emptyReviews && appearance.toFixed(1)}
                  </span>
                </dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("taste")}
                </dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div
                      className={`bg-beer-blonde h-2.5 rounded dark:bg-blue-500 `}
                      style={{
                        width: `${getPercentage(taste)}`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {!emptyReviews && taste.toFixed(1)}
                  </span>
                </dd>
              </dl>
            </div>
            <div>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("mouthfeel")}
                </dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div
                      className={`bg-beer-blonde h-2.5 rounded dark:bg-blue-500`}
                      style={{
                        width: `${getPercentage(mouthfeel)}`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {!emptyReviews && mouthfeel.toFixed(1)}
                  </span>
                </dd>
              </dl>

              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("bitterness")}
                </dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div
                      className={`bg-beer-blonde h-2.5 rounded dark:bg-blue-500`}
                      style={{
                        width: `${getPercentage(bitterness)}`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {!emptyReviews && bitterness.toFixed(1)}
                  </span>
                </dd>
              </dl>

              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 ">
                  {t("overall")}
                </dt>
                <dd className="flex items-center ">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2 ">
                    <div
                      className={`bg-beer-blonde h-2.5 rounded dark:bg-blue-500 `}
                      style={{
                        width: `${getPercentage(overall)}`,
                      }}
                    ></div>
                  </div>
                  <span className="text-lg font-medium text-gray-500 dark:text-gray-400 animate-neon_beer">
                    {!emptyReviews && overall.toFixed(1)}
                  </span>
                </dd>
              </dl>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
