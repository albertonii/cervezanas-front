"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Rate } from ".";
import { IReview } from "../../lib/types.d";
import { Button } from "../common";
import { useSupabase } from "../Context/SupabaseProvider";
import { useMessage } from "../message";
import { SuccessfulReviewModal } from "../modals";

type FormValues = {
  aroma: number;
  appearance: number;
  taste: number;
  mouthfeel: number;
  bitterness: number;
  overall: number;
  comment: string;
};

interface Props {
  productId: string;
  ownerId: string;
  handleSetReviews?: React.Dispatch<React.SetStateAction<IReview[]>>;
  isReady?: boolean;
}

export function NewProductReview({
  productId,
  ownerId,
  handleSetReviews,
  isReady: isReady_,
}: Props) {
  const { t } = useTranslation();
  const { supabase } = useSupabase();

  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(isReady_);
  const [reviewModal, setReviewModal] = useState(false);

  const [aromaRate, setAromaRate] = useState<number>(0);
  const [appearanceRate, setAppearanceRate] = useState<number>(0);
  const [tasteRate, setTasteRate] = useState<number>(0);
  const [mouthfeelRate, setMouthfeelRate] = useState<number>(0);
  const [bitternessRate, setBitternessRate] = useState<number>(0);
  const [overallRate, setOverallRate] = useState<number>(0);

  const { handleMessage } = useMessage();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>();

  const onSubmit = async (formValues: FormValues) => {
    try {
      const { comment } = formValues;

      const { data, error: reviewError } = await supabase
        .from("reviews")
        .insert({
          aroma: aromaRate,
          appearance: appearanceRate,
          taste: tasteRate,
          mouthfeel: mouthfeelRate,
          bitterness: bitternessRate,
          overall: overallRate,
          comment,
          owner_id: ownerId,
          product_id: productId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (reviewError) throw reviewError;
      if (!data) throw new Error("No data");

      const review = data[0] as IReview;

      if (handleSetReviews)
        handleSetReviews((prev) => [
          ...prev,
          {
            id: review.id,
            aroma: aromaRate,
            appearance: appearanceRate,
            taste: tasteRate,
            mouthfeel: mouthfeelRate,
            bitterness: bitternessRate,
            overall: overallRate,
            comment,
            owner_id: ownerId,
            product_id: productId,
            created_at: review.created_at,
            updated_at: review.updated_at,
          },
        ]);

      handleMessage({
        message: t("successful_product_review_creation"),
        type: "success",
      });

      reset();

      setReviewModal(true);
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };

  const starColor = { filled: "#fdc300", unfilled: "#a87a12" };

  return (
    <>
      {isReady ? (
        <section>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {/* Stars  */}
                <div className="w-full text-xl ">
                  <label htmlFor="aroma">{t("aroma")}</label>

                  <Rate
                    rating={aromaRate}
                    onRating={(rate) => setAromaRate(rate)}
                    count={5}
                    color={starColor}
                    editable={true}
                  />
                </div>

                <div className="mb-4 w-full text-xl">
                  <label htmlFor="appearance">{t("appearance")}</label>
                  <Rate
                    rating={appearanceRate}
                    onRating={(rate) => setAppearanceRate(rate)}
                    count={5}
                    color={starColor}
                    editable={true}
                  />
                </div>

                <div className="mb-4 w-full text-xl">
                  <label htmlFor="taste">{t("taste")}</label>
                  <Rate
                    rating={tasteRate}
                    onRating={(rate) => setTasteRate(rate)}
                    count={5}
                    color={starColor}
                    editable={true}
                  />
                </div>

                <div className="mb-4 w-full text-xl">
                  <label htmlFor="mouthfeel">{t("mouthfeel")}</label>
                  <Rate
                    rating={mouthfeelRate}
                    onRating={(rate) => setMouthfeelRate(rate)}
                    count={5}
                    color={starColor}
                    editable={true}
                  />
                </div>

                <div className="mb-4 w-full text-xl">
                  <label htmlFor="bitterness">{t("bitterness")}</label>
                  <Rate
                    rating={bitternessRate}
                    onRating={(rate) => setBitternessRate(rate)}
                    count={5}
                    color={starColor}
                    editable={true}
                  />
                </div>

                <div className="mb-4 w-full text-xl">
                  <label htmlFor="overall">{t("overall")}</label>
                  <Rate
                    rating={overallRate}
                    onRating={(rate) => setOverallRate(rate)}
                    count={5}
                    color={starColor}
                    editable={true}
                  />
                </div>
              </div>

              {/* Comment  */}
              <div className="mt-6 flex w-full flex-row space-x-12">
                <div className="mb-6 w-full">
                  <label
                    htmlFor="comment"
                    className="mb-2 block text-xl  font-medium dark:text-white"
                  >
                    {t("comment")}
                  </label>

                  <textarea
                    id="comment"
                    className="sm:text-md inline-block h-24 w-full rounded-lg border border-gray-300 bg-gray-50 p-4 align-top focus:border-beer-blonde focus:ring-beer-blonde dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-beer-blonde dark:focus:ring-beer-blonde"
                    {...register("comment", {
                      required: "Required",
                    })}
                    style={{ resize: "none" }}
                  />
                  {errors.comment && <p>{errors.comment.message}</p>}
                </div>
              </div>

              {/* Rate  */}
              <div className="flex w-full flex-row space-x-2">
                <Button
                  btnType="submit"
                  disabled={loading}
                  isActive={false}
                  class={""}
                  title={""}
                  medium
                  primary
                >
                  {loading ? t("loading") : t("rate")}
                </Button>

                <Button
                  class={"ml-2"}
                  onClick={() => setIsReady(false)}
                  disabled={loading}
                  isActive={false}
                  title={""}
                  medium
                >
                  {t("cancel")}
                </Button>
              </div>
            </form>
          </div>
        </section>
      ) : (
        <div className="flex w-full flex-row space-x-12">
          <div className="w-full">
            <Button
              onClick={() => setIsReady(true)}
              disabled={loading}
              isActive={false}
              class={""}
              title={""}
            >
              {loading ? t("loading") : t("write_review")}
            </Button>
          </div>
        </div>
      )}

      {reviewModal && (
        <SuccessfulReviewModal isVisible={true}></SuccessfulReviewModal>
      )}
    </>
  );
}
