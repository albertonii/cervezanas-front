import { Button } from "@supabase/ui";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Review } from "../../lib/types";
import { supabase } from "../../utils/supabaseClient";
import Rate from "./Rate";

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
  beerId: string;
  ownerId: string;
  handleSetReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

export default function NewProductReview({
  beerId,
  ownerId,
  handleSetReviews,
}: Props) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [aromaRate, setAromaRate] = useState<number>(0);
  const [appearanceRate, setAppearanceRate] = useState<number>(0);
  const [tasteRate, setTasteRate] = useState<number>(0);
  const [mouthfeelRate, setMouthfeelRate] = useState<number>(0);
  const [bitternessRate, setBitternessRate] = useState<number>(0);
  const [overallRate, setOverallRate] = useState<number>(0);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      aroma: 0,
      appearance: 0,
      taste: 0,
      mouthfeel: 0,
      bitterness: 0,
      overall: 0,
      comment: "",
    },
  });

  const onSubmit = async (formValues: FormValues) => {
    try {
      const { comment } = formValues;

      const { data: review, error: reviewError } = await supabase
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
          beer_id: beerId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (reviewError) {
        throw reviewError;
      }

      handleSetReviews((prev) => [
        ...prev,
        {
          id: review[0].id,
          aroma: aromaRate,
          appearance: appearanceRate,
          taste: tasteRate,
          mouthfeel: mouthfeelRate,
          bitterness: bitternessRate,
          overall: overallRate,
          comment,
          owner_id: ownerId,
          beer_id: beerId,
          created_at: review[0].created_at,
          updated_at: review[0].updated_at,
        },
      ]);

      alert("Review created!");
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
      setIsReady(false);
    }
  };

  const starColor = { filled: "#fdc300", unfilled: "#a87a12" };

  return (
    <>
      {isReady ? (
        <section>
          <div>Escribir review de cerveza:</div>

          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex w-full flex-row space-x-3">
                <div className="w-full">
                  <label htmlFor="aroma">Aroma</label>

                  <Rate
                    rating={aromaRate}
                    onRating={(rate) => setAromaRate(rate)}
                    count={5}
                    color={starColor}
                    editable={true}
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="appearance">Appearance</label>
                  <Rate
                    rating={appearanceRate}
                    onRating={(rate) => setAppearanceRate(rate)}
                    count={5}
                    color={starColor}
                    editable={true}
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="taste">Taste</label>
                  <Rate
                    rating={tasteRate}
                    onRating={(rate) => setTasteRate(rate)}
                    count={5}
                    color={starColor}
                    editable={true}
                  />
                </div>
              </div>

              <div className="flex w-full flex-row space-x-3">
                <div className="w-full">
                  <label htmlFor="mouthfeel">Mouthfeel</label>
                  <Rate
                    rating={mouthfeelRate}
                    onRating={(rate) => setMouthfeelRate(rate)}
                    count={5}
                    color={starColor}
                    editable={true}
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="bitterness">Bitterness</label>
                  <Rate
                    rating={bitternessRate}
                    onRating={(rate) => setBitternessRate(rate)}
                    count={5}
                    color={starColor}
                    editable={true}
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="overall">Overall</label>
                  <Rate
                    rating={overallRate}
                    onRating={(rate) => setOverallRate(rate)}
                    count={5}
                    color={starColor}
                    editable={true}
                  />
                </div>
              </div>

              <div className="flex w-full flex-row space-x-12">
                <div className="w-full mb-6">
                  <label
                    htmlFor="comment"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Comment
                  </label>
                  <input
                    id="comment"
                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    {...register("comment", {
                      required: "Required",
                    })}
                  />
                  {errors.comment && <p>{errors.comment.message}</p>}
                </div>
              </div>

              <div className="flex w-full flex-row space-x-12">
                <div className="w-full">
                  <Button disabled={loading}>
                    {loading ? "Loading..." : "Submit"}
                  </Button>

                  <Button
                    className={"ml-2"}
                    onClick={() => setIsReady(false)}
                    disabled={loading}
                    type="secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </section>
      ) : (
        <div className="flex w-full flex-row space-x-12">
          <div className="w-full">
            <Button onClick={() => setIsReady(true)} disabled={loading}>
              {loading ? t("loading") : t("write_review")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}