import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { IReview } from "../../lib/types.d";
import { ReviewQualification } from "../../lib/beerEnum";

interface Props {
  reviews: IReview[];
  emptyReviews: boolean;
}

export function ProductOverallReview({ reviews, emptyReviews }: Props) {
  const t = useTranslations();

  const [loading, setLoading] = React.useState(false);

  const [aroma, setAroma] = React.useState(0);
  const [appearance, setAppearance] = React.useState(0);
  const [taste, setTaste] = React.useState(0);
  const [mouthfeel, setMouthfeel] = React.useState(0);
  const [bitterness, setBitterness] = React.useState(0);
  const [overall, setOverall] = React.useState(0);
  const [qualification, setQualification] = React.useState(
    ReviewQualification.not_qualified
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
        setQualification(ReviewQualification.need_to_improve);
        break;
      case overall < 3:
        setQualification(ReviewQualification.fair);
        break;
      case overall < 4:
        setQualification(ReviewQualification.good);
        break;
      case overall < 4.7:
        setQualification(ReviewQualification.very_good);
        break;
      case overall < 5:
        setQualification(ReviewQualification.excellent);
        break;
      case overall === 5:
        setQualification(ReviewQualification.superb);
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
          <div className="mb-5 flex items-center">
            <p className="inline-flex items-center rounded bg-blue-100 p-1.5 text-lg font-semibold text-beer-blonde dark:bg-blue-200 dark:text-blue-800">
              {!emptyReviews ? overall.toFixed(1) : 0}
            </p>
            <p
              className={`ml-2 font-medium text-gray-900 dark:text-white ${
                qualification == ReviewQualification.superb && !emptyReviews
                  ? "animate-bounce bg-gradient-to-r from-beer-dark to-beer-blonde bg-clip-text text-2xl text-transparent"
                  : ""
              }`}
            >
              {!emptyReviews ? t(qualification) : t("not_qualified")}
            </p>
            <span className="mx-2 h-1 w-1 rounded-full bg-gray-900 dark:bg-gray-500"></span>
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
                <dd className="mb-3 flex items-center">
                  <div className="mr-2 h-2.5 w-full rounded bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-2.5 rounded bg-beer-blonde dark:bg-blue-500 `}
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
                <dd className="mb-3 flex items-center">
                  <div className="mr-2 h-2.5 w-full rounded bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-2.5 rounded bg-beer-blonde dark:bg-blue-500 `}
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
                <dd className="mb-3 flex items-center">
                  <div className="mr-2 h-2.5 w-full rounded bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-2.5 rounded bg-beer-blonde dark:bg-blue-500 `}
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
                <dd className="mb-3 flex items-center">
                  <div className="mr-2 h-2.5 w-full rounded bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-2.5 rounded bg-beer-blonde dark:bg-blue-500`}
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
                <dd className="mb-3 flex items-center">
                  <div className="mr-2 h-2.5 w-full rounded bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-2.5 rounded bg-beer-blonde dark:bg-blue-500`}
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
                  <div className="mr-2 h-2.5 w-full rounded bg-gray-200 dark:bg-gray-700 ">
                    <div
                      className={`h-2.5 rounded bg-beer-blonde dark:bg-blue-500 `}
                      style={{
                        width: `${getPercentage(overall)}`,
                      }}
                    ></div>
                  </div>
                  <span className="animate-neon_beer text-lg font-medium text-gray-500 dark:text-gray-400">
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
