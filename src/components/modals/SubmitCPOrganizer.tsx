import React, { ComponentProps } from "react";
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

interface Props {
  handleCPOrganizerStatus: ComponentProps<any>;
}

{
  /**
  CP Organizer status:
    -1: not submitted
    0: pending
    1: accepted
    2: rejected
 */
}
export function SubmitCPOrganizer({ handleCPOrganizerStatus }: Props) {
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
      const coverLetterName = encodeURIComponent(cover_letter_file[0].name);
      const cvName = encodeURIComponent(cv_file[0].name);

      if (isValidObject(cover_letter_file) && isValidObject(cv_file)) {
        // Update user status
        const { error: cpError } = await supabase
          .from("consumption_points")
          .insert({
            cp_organizer_status: 0,
            owner_id: user?.id,
            cover_letter_name: coverLetterName,
            cv_name: cvName,
          }) // 0: pending
          .then((res) => {
            handleCPOrganizerStatus(0);
            return res;
          })
          .then(async (res) => {
            // Update user status
            const { error: userError } = await supabase
              .from("users")
              .update({ cp_organizer_status: 0 }) // 0: pending
              .eq("id", user?.id)
              .then((res) => {
                handleCPOrganizerStatus(0);
                return res;
              });

            if (userError) throw userError;

            return res;
          });

        if (cpError) throw cpError;

        const { error: coverLetterError } = await supabase.storage
          .from("documents")
          .upload(
            `/cover_letter/${user?.id}_${coverLetterName}`,
            cover_letter_file[0],
            {
              upsert: true,
              cacheControl: "0",
            }
          )
          .then(async (res) => {
            const { error: cvError } = await supabase.storage
              .from("documents")
              .upload(`/cv/${user?.id}_${cvName}`, cv_file[0], {
                upsert: true,
                cacheControl: "0",
              })
              .catch((err) => {
                console.log(err);
                throw cvError;
              })
              .then(async (res) => {
                return res;
              });

            return res;
          })
          .catch((err) => {
            console.log(err);
            throw coverLetterError;
          });
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
