import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getFileExtensionByName } from "../../utils";
import { supabase } from "../../utils/supabaseClient";
import { isValidObject } from "../../utils/utils";
import { useAuth } from "../Auth";
import { Modal } from "./Modal";

type FormValues = {
  created_at: Date;
  cover_letter_file: File[];
  cv_file: File[];
};

export function SubmitCPOrganizer() {
  const { t } = useTranslation();

  const { user } = useAuth();

  const form = useForm<FormValues>({
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = (formValues: FormValues) => {
    const { cover_letter_file, cv_file } = formValues;

    const submitCPOrganizer = async () => {
      if (isValidObject(cover_letter_file) && isValidObject(cv_file)) {
        const { error: coverLetterError } = await supabase.storage
          .from("documents")
          .upload(
            `/cover_letter/${user?.id}.${getFileExtensionByName(
              cover_letter_file[0].name
            )}`,
            cover_letter_file[0],
            {
              upsert: true,
              cacheControl: "0",
            }
          );

        if (coverLetterError) throw coverLetterError;

        const { error: cvError } = await supabase.storage
          .from("documents")
          .upload(
            `/cv/${user?.id}.${getFileExtensionByName(cv_file[0].name)}`,
            cv_file[0],
            {
              upsert: true,
              cacheControl: "0",
            }
          );

        if (cvError) throw cvError;
      } else {
        return null;
      }

      reset();
    };

    submitCPOrganizer();
  };

  return (
    <form className="w-full">
      <Modal
        showBtn={true}
        isVisible={false}
        title={"form_submit_cp_organizer_title"}
        btnTitle={"apply_cp_organizer"}
        description={"form_submit_cp_organizer_description"}
        handler={handleSubmit(onSubmit)}
        classIcon={""}
        classContainer={""}
      >
        <div className="space-y-4">
          <fieldset className="flex flex-col space-y-2">
            {/* Input pdf file with cover letter  */}
            <div className="flex flex-col space-y-2">
              <label className="text-md font-bold text-gray-700 tracking-wide">
                {t("form_submit_cp_organizer_cover_letter")}
              </label>

              <span className="text-sm text-gray-500">
                {t("form_submit_cp_organizer_cover_letter_description")}
              </span>

              <div className="relative">
                <input
                  type="file"
                  className="block w-full px-4 py-3 pr-8 leading-tight text-gray-700 bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
                  {...register("cover_letter_file", {
                    required: true,
                  })}
                  accept=".pdf,.doc,.docs"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                  <svg
                    className="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                  </svg>
                </div>
              </div>
              {errors.cover_letter_file && (
                <p className="text-xs italic text-red-500">
                  {t("form_submit_cp_organizer_cover_letter_error")}
                </p>
              )}
            </div>

            {/* Input pdf file with BEER CV  */}
            <div className="flex flex-col space-y-2">
              <label className="text-md font-bold text-gray-700 tracking-wide">
                {t("form_submit_cp_organizer_cv")}
              </label>

              <span className="text-sm text-gray-500">
                {t("form_submit_cp_organizer_cv_description")}
              </span>

              <div className="relative">
                <input
                  type="file"
                  className="block w-full px-4 py-3 pr-8 leading-tight text-gray-700 bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
                  {...register("cv_file", {
                    required: true,
                  })}
                  accept=".pdf,.doc,.docs"
                />

                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                  <svg
                    className="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                  </svg>
                </div>
              </div>
              {errors.cv_file && (
                <p className="text-xs italic text-red-500">
                  {t("form_submit_cp_organizer_cv_error")}
                </p>
              )}
            </div>
          </fieldset>
        </div>
      </Modal>
    </form>
  );
}
