import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  aroma: string;
  appearance: number;
  taste: number;
  mouthfeel: number;
  bitterness: number;
  overall: number;
  comment: string;
};

export default function NewProductReview() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
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

  const onSubmit = async () => {
    try {
      setLoading(true);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div>Escribir review de cerveza:</div>

      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-row space-x-3">
            <div className="w-full">
              <label htmlFor="aroma">Aroma</label>
              <input
                type="number"
                {...register("aroma", {
                  required: "Required",
                  min: { value: 0, message: "Min 0" },
                  max: { value: 10, message: "Max 10" },
                })}
              />
              {errors.aroma && <p>{errors.aroma.message}</p>}
            </div>

            <div className="w-full">
              <label htmlFor="appearance">Appearance</label>
              <input
                type="number"
                {...register("appearance", {
                  required: "Required",
                  min: { value: 0, message: "Min 0" },
                  max: { value: 10, message: "Max 10" },
                })}
              />
              {errors.appearance && <p>{errors.appearance.message}</p>}
            </div>

            <div className="w-full">
              <label htmlFor="taste">Taste</label>
              <input
                type="number"
                {...register("taste", {
                  required: "Required",
                  min: { value: 0, message: "Min 0" },
                  max: { value: 10, message: "Max 10" },
                })}
              />
              {errors.taste && <p>{errors.taste.message}</p>}
            </div>
          </div>

          <div className="flex w-full flex-row space-x-3">
            <div className="w-full">
              <label htmlFor="mouthfeel">Mouthfeel</label>
              <input
                type="number"
                {...register("mouthfeel", {
                  required: "Required",
                  min: { value: 0, message: "Min 0" },
                  max: { value: 10, message: "Max 10" },
                })}
              />
              {errors.mouthfeel && <p>{errors.mouthfeel.message}</p>}
            </div>

            <div className="w-full">
              <label htmlFor="bitterness">Bitterness</label>
              <input
                type="number"
                {...register("bitterness", {
                  required: "Required",
                  min: { value: 0, message: "Min 0" },
                  max: { value: 10, message: "Max 10" },
                })}
              />
              {errors.bitterness && <p>{errors.bitterness.message}</p>}
            </div>

            <div className="w-full">
              <label htmlFor="overall">Overall</label>
              <input
                type="number"
                {...register("overall", {
                  required: "Required",
                  min: { value: 0, message: "Min 0" },
                  max: { value: 10, message: "Max 10" },
                })}
              />
              {errors.overall && <p>{errors.overall.message}</p>}
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
              <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
