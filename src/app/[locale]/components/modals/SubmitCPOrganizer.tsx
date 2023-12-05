"use client";

import React, { ComponentProps, useState } from "react";
import { Modal } from "./Modal";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useAuth } from "../../Auth/useAuth";
import { isValidObject } from "../../../../utils/utils";
import { DisplayInputError } from "../common/DisplayInputError";

type FormData = {
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
  const t = useTranslations();

  const { user, supabase } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);

  const form = useForm<FormData>({
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = (form: FormData) => {
    const { cover_letter_file, cv_file } = form;

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
          .then((res: any) => {
            handleCPOrganizerStatus(0);
            return res;
          })
          .then(async (res: any) => {
            if (!user) return null;

            // Update user status
            const { error: userError } = await supabase
              .from("users")
              .update({ cp_organizer_status: 0 }) // 0: pending
              .eq("id", user.id)
              .then((res: any) => {
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
          .then(async (res: any) => {
            const { error: cvError } = await supabase.storage
              .from("documents")
              .upload(`/cv/${user?.id}_${cvName}`, cv_file[0], {
                upsert: true,
                cacheControl: "0",
              })
              .catch((err: Error) => {
                console.error(err);
                throw cvError;
              })
              .then(async (res: any) => {
                return res;
              });

            return res;
          })
          .catch((err: Error) => {
            console.error(err);
            throw coverLetterError;
          });
      } else {
        return null;
      }

      reset();
    };

    submitCPOrganizer();

    setShowModal(false);
  };

  return (
    <form className="w-full">
      <Modal
        showBtn={true}
        showModal={showModal}
        setShowModal={setShowModal}
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
              <label className="text-md font-bold tracking-wide text-gray-700">
                {t("form_submit_cp_organizer_cover_letter")}
              </label>

              <span className="text-sm text-gray-500">
                {t("form_submit_cp_organizer_cover_letter_description")}
              </span>

              <div className="relative">
                <input
                  type="file"
                  className="block w-full appearance-none rounded border border-gray-300 bg-white px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  {...register("cover_letter_file", {
                    required: true,
                  })}
                  accept=".pdf,.doc,.docs"
                />
              </div>

              {errors.cover_letter_file && (
                <DisplayInputError message={errors.cover_letter_file.message} />
              )}
            </div>

            {/* Input pdf file with BEER CV  */}
            <div className="flex flex-col space-y-2">
              <label className="text-md font-bold tracking-wide text-gray-700">
                {t("form_submit_cp_organizer_cv")}
              </label>

              <span className="text-sm text-gray-500">
                {t("form_submit_cp_organizer_cv_description")}
              </span>

              <div className="relative">
                <input
                  type="file"
                  className="block w-full appearance-none rounded border border-gray-300 bg-white px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  {...register("cv_file", {
                    required: true,
                  })}
                  accept=".pdf,.doc,.docs"
                />
              </div>

              {errors.cv_file && (
                <DisplayInputError message={errors.cv_file.message} />
              )}
            </div>
          </fieldset>
        </div>
      </Modal>
    </form>
  );
}
