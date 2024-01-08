"use client";

import React, { useEffect, useState } from "react";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "react-query";
import ModalWithForm from "../../../../components/modals/ModalWithForm";
import { ModalAddCampaignFormData } from "../../../../../../lib/types";
import { useAuth } from "../../../../Auth/useAuth";
import { DisplayInputError } from "../../../../components/common/DisplayInputError";
import SelectInput from "../../../../components/common/SelectInput";
import { SupabaseProps } from "../../../../../../constants";
import { FilePreviewImageMultimedia } from "../../../../components/common/FilePreviewImageMultimedia";

enum CampaignStatus {
  uninitialized = "uninitialized",
  active = "active",
  finished = "finished",
  cancelled = "cancelled",
  paused = "paused",
}

export const campaign_status_options: {
  label: string;
  value: CampaignStatus;
}[] = [
  { label: "uninitialized", value: CampaignStatus.uninitialized },
  { label: "active", value: CampaignStatus.active },
  { label: "finished", value: CampaignStatus.finished },
  { label: "cancelled", value: CampaignStatus.cancelled },
  { label: "paused", value: CampaignStatus.paused },
];

const schema: ZodType<ModalAddCampaignFormData> = z.object({
  name: z.string().min(2, { message: "errors.input_min_2" }).max(50, {
    message: "errors.error_50_number_max_length",
  }),
  description: z.string().min(2, { message: "errors.input_min_2" }).max(2500, {
    message: "errors.error_2500_max_length",
  }),
  img_url: z.instanceof(FileList).optional(),
  is_public: z.boolean(),
  start_date: z.date(),
  end_date: z.date(),
  slogan: z.string().min(2, { message: "errors.input_min_2" }).max(50, {
    message: "errors.error_50_number_max_length",
  }),
  goal: z.string().min(2, { message: "errors.input_min_2" }).max(50, {
    message: "errors.error_50_number_max_length",
  }),
  status: z.string().nonempty({
    message: "errors.input_required",
  }),
});

type ValidationSchema = z.infer<typeof schema>;

export function AddCampaign() {
  const t = useTranslations();

  const preUrl =
    SupabaseProps.BASE_URL + SupabaseProps.STORAGE_PRODUCTS_IMG_URL;

  const { supabase, user } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);

  const form = useForm<ValidationSchema>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      is_public: false,
      slogan: "",
      goal: "",
      status: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const handleInsertCampaign = async (form: ValidationSchema) => {
    const {
      name,
      description,
      img_url,
      is_public,
      start_date,
      end_date,
      slogan,
      goal,
      status,
    } = form;

    const { error } = await supabase.from("campaigns").insert({
      name,
      description,
      img_url,
      is_public,
      start_date,
      end_date,
      slogan,
      goal,
      status,
      owner_id: user.id,
      campaign_discount: 0,
      social_cause: "",
    });

    if (error) {
      throw error;
    }
  };

  const insertCampaignMutation = useMutation({
    mutationKey: ["insertCampaign"],
    mutationFn: handleInsertCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaignList"] });
      setShowModal(false);
      reset();
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (
    formValues: ModalAddCampaignFormData
  ) => {
    try {
      insertCampaignMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ModalWithForm
      showBtn={true}
      showModal={showModal}
      setShowModal={setShowModal}
      title={"add_campaign"}
      btnTitle={"add_campaign"}
      description={""}
      classIcon={""}
      classContainer={""}
      handler={handleSubmit(onSubmit)}
      handlerClose={() => {
        setShowModal(false);
      }}
      form={form}
    >
      <form className="relative flex-auto space-y-4">
        <div className="flex w-full flex-col items-end">
          <label
            className="relative inline-flex cursor-pointer items-center"
            htmlFor="is_public"
          >
            <input
              id="is_public"
              type="checkbox"
              className="peer sr-only"
              {...register("is_public", {
                required: true,
              })}
              defaultChecked={true}
            />

            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-beer-blonde peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beer-softFoam dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-beer-blonde"></div>

            <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300">
              {t("is_public_campaign")}
            </span>
          </label>

          <span className="mt-2 text-sm font-medium text-gray-400 dark:text-gray-300">
            {t("is_public_campaign_description")}
          </span>
        </div>

        {/* name & status  */}
        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full">
            <label htmlFor="campaign_name" className="text-sm text-gray-600">
              {t("campaign_name")}

              <input
                type="text"
                id="campaign_name"
                placeholder="Christmass campaign"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register("name", {
                  required: true,
                })}
              />
            </label>

            {errors.name && <DisplayInputError message={errors.name.message} />}
          </div>

          <SelectInput
            form={form}
            hasInfoTooltip={true}
            labelTooltip={"campaign_status_tooltip"}
            options={campaign_status_options}
            label={"status"}
            registerOptions={{
              required: true,
            }}
          />
        </div>

        {/* Description  */}
        <div className="flex w-full flex-row space-x-3 ">
          <div className="space-y w-full">
            <label htmlFor="description" className="text-sm text-gray-600">
              {t("campaign_description")}

              <textarea
                id="description"
                placeholder="Campaign description"
                className="min-h-20 relative block max-h-56 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register("description", {
                  required: true,
                })}
              />
            </label>

            {errors.description && (
              <DisplayInputError message={errors.description.message} />
            )}
          </div>
        </div>

        <div className="flex w-full flex-row">
          <div className="w-full ">
            <label htmlFor="slogan" className="text-sm text-gray-600">
              {t("slogan")}

              <input
                id="slogan"
                type="text"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register(`slogan`, {
                  required: true,
                })}
              />
            </label>

            {errors.slogan && (
              <DisplayInputError message={errors.slogan.message} />
            )}
          </div>
        </div>

        <div className="flex w-full flex-col">
          <label htmlFor="goal" className="w-full text-sm text-gray-600">
            {t("goal")}

            <input
              id="goal"
              type="text"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register(`goal`, {
                required: true,
              })}
            />
          </label>

          {errors.goal && <DisplayInputError message={errors.goal.message} />}
        </div>

        <div className="flex flex-row space-x-4">
          <div className="w-full">
            <label htmlFor="start_date" className="flex flex-col">
              {t("start_date")}
              <input
                type="date"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register("start_date", {
                  required: true,
                  valueAsDate: true,
                })}
              />
            </label>

            {errors.start_date && (
              <DisplayInputError message="errors.input_required" />
            )}
          </div>

          <div className="w-full">
            <label htmlFor="end_date" className="flex flex-col">
              {t("end_date")}
              <input
                type="date"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register("end_date", {
                  required: true,
                  valueAsDate: true,
                })}
              />
            </label>

            {errors.end_date && (
              <DisplayInputError message="errors.input_required" />
            )}
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-base">{t("campaign_logo")}</h2>

          <FilePreviewImageMultimedia
            form={form}
            registerName={`img_url`}
            preUrl={preUrl}
          />
        </div>
      </form>
    </ModalWithForm>
  );
}
