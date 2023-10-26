"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Spinner } from "../../../../components/common/Spinner";
import { useAuth } from "../../../../Auth/useAuth";

export function HistoryForm(props: any) {
  const t = useTranslations();
  const { supabase } = useAuth();

  const {
    id: id_,
    description: description_,
    foundationYear: foundationYear_,
  } = props.historyData[0];

  const [loading, setLoading] = useState(false);

  const [id, setId] = useState(id_);
  const [description, setDescription] = useState(description_);
  const [foundationYear, setFoundationYear] = useState(foundationYear_);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      description: description_,
      foundationYear: foundationYear_,
    },
  });

  useEffect(() => {
    setId(id_);

    () => {
      setId(null);
    };
  }, [id_]);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const updates = {
        id,
        description,
        foundationYear,
      };

      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", id);
      setLoading(false);

      if (error) throw error;
    } catch (error) {
      alert("Error updating the data!");
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="history" className="container mb-4 space-y-3 bg-white px-6 py-4">
      <div id="history-data" className="text-2xl">
        {t("history_business_title")}
      </div>
      {loading ? (
        <Spinner size="medium" color="beer-blonde" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label
                htmlFor="history_description"
                className="text-sm text-gray-600"
              >
                {t("history_business_description")}
              </label>
              {/* <input type="text" /> */}
              <textarea
                id="description"
                placeholder=""
                readOnly
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                value={description}
                {...register("description")}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="w-full ">
              <label
                htmlFor="foundtation_year"
                className="text-sm text-gray-600"
              >
                {t("history_business_year")}
              </label>
              <input
                type="number"
                id="foundtation_year"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                value={foundationYear}
                {...register("foundationYear")}
                onChange={(e) => setFoundationYear(e.target.value)}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
