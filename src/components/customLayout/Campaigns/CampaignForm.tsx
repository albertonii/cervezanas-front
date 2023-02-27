import React, { useState, ComponentProps, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Campaign, CampaignFormProps, CampaignItem } from "../../../lib/types";
import { supabase } from "../../../utils/supabaseClient";
import { useAuth } from "../../Auth";
import { Button } from "../../common";
import { useMessage } from "../../message";

type Props = {
  index: number;
  campaigns: Campaign[];
  field: any;
  handleDeleteShowModal: ComponentProps<any>;
  handleShowProductsInCampaignModal: ComponentProps<any>;
  handleSaveCampaign: ComponentProps<any>;
  form: UseFormReturn<any, any>;
};

export function CampaignForm({
  index,
  field,
  handleDeleteShowModal,
  handleShowProductsInCampaignModal,
  handleSaveCampaign,
  form,
}: Props) {
  const { t } = useTranslation();

  const { user } = useAuth();

  const { handleMessage } = useMessage();

  const { register, getValues } = form;

  const api_handleSaveCampaign = async (index: number) => {
    const campaign = getValues("campaigns")[index];

    if (campaign.id === "" || campaign.id === undefined) {
      const { data: campaign_, error: campaignError } = await supabase
        .from("campaigns")
        .insert({
          name: campaign.name,
          description: campaign.description,
          img_url: campaign.img_url,
          is_public: campaign.is_public,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          owner_id: user?.id ?? "",
          slogan: campaign.slogan,
          goal: campaign.goal,
          status: campaign.status,
        });

      if (campaignError) throw campaignError;

      if (campaign_[index]?.id !== campaign.id) {
        campaign.id = campaign_[0].id;
        handleSaveCampaign(campaign);
      }
    } else {
      const { data: campaign_, error: campaignError } = await supabase
        .from("campaigns")
        .update({
          name: campaign.name,
          description: campaign.description,
          img_url: campaign.img_url,
          is_public: campaign.is_public,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          owner_id: user?.id ?? "",
          slogan: campaign.slogan,
          goal: campaign.goal,
          status: campaign.status,
        })
        .eq("id", campaign.id);

      if (campaignError) throw campaignError;

      if (campaign_[index]?.id !== campaign.id) {
        campaign.id = campaign_[0].id;
        handleSaveCampaign(campaign);
      }
    }

    const products = getValues("products");

    products.map(async (item: CampaignItem) => {
      if (item.product_id === false) {
        const { error: orderItemError } = await supabase
          .from("campaign_item")
          .delete()
          .eq("campaign_id", campaign.id);

        if (orderItemError) throw orderItemError;
      } else if (typeof item.product_id === "string") {
        products?.map(async (item: any) => {
          const { error: orderItemError } = await supabase
            .from("campaign_item")
            .upsert({
              campaign_id: campaign.id,
              product_id: item.product_id,
              discount: item.discount,
            });

          if (orderItemError) throw orderItemError;
        });
      }
    });

    handleMessage!({
      type: "success",
      message: `${t("campaign_added_successfully")} , ${campaign.name}`,
    });
  };

  return (
    <form>
      <fieldset className="p-4 bg-beer-softBlonde rounded space-y-2">
        {/* Campaign Image */}
        <div className="flex flex-col w-full space-y">
          <label
            htmlFor={`${index}-campaign_img_url`}
            className="text-sm text-gray-600 mr-2"
          >
            {t("img_url")}
          </label>

          <input
            type="file"
            className="border border-gray-300 rounded-md p-2"
            defaultValue=""
            {...register(`campaigns.${index}.img_url` as const, {
              required: true,
            })}
          />
          {`errors.campaigns.${index}.img_url.type` === "required" && (
            <p>{t("input_required")}</p>
          )}
        </div>

        {/* Campaign Name  */}
        <div className="flex flex-col w-full space-y">
          <label
            htmlFor={`${index}-campaign_name`}
            className="text-sm text-gray-600 mr-2"
          >
            {t("name")}
          </label>

          <input
            id={`${index}-campaign_name`}
            className="border border-gray-300 rounded-md"
            defaultValue={field.name}
            {...register(`campaigns.${index}.name` as const, {
              required: true,
              maxLength: 30,
            })}
          />
          {`errors.campaigns.${index}.name.type` === "required" && (
            <p>{t("input_required")}</p>
          )}
          {`errors.campaigns.${index}.name.type` === "maxLength" && (
            <p>{t("error_30_max_length")}</p>
          )}
        </div>

        {/* Description  */}
        <div className="flex flex-col w-full space-y">
          <label
            htmlFor={`${index}-campaign_description`}
            className="text-sm text-gray-600 mr-2"
          >
            {t("description")}
          </label>

          <textarea
            id={`${index}-campaign_description`}
            className="border border-gray-300 rounded-md"
            defaultValue={field.description}
            {...register(`campaigns.${index}.description` as const, {
              required: true,
              maxLength: 200,
            })}
          />
          {`errors.campaigns.${index}.description.type` === "required" && (
            <p>{t("input_required")}</p>
          )}
          {`errors.campaigns.${index}.description.type` === "maxLength" && (
            <p>{t("error_200_max_length")}</p>
          )}
        </div>

        {/* Is Public  */}
        <div className="flex flex-col w-full space-y">
          <label
            htmlFor={`${index}-campaign_is_public`}
            className="text-sm text-gray-600 mr-2"
          >
            {t("is_public_campaign")}
          </label>

          <select
            id={`${index}-campaign_is_public`}
            defaultValue="false"
            className="text-sm relative block w-20 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            {...register(`campaigns.${index}.is_public` as const)}
          >
            <option key={0} value={"false"}>
              {t("no")}
            </option>
            <option key={1} value={"true"}>
              {t("yes")}
            </option>
          </select>

          {`errors.campaigns.${index}.is_public?.type` === "required" && (
            <p>{t("input_required")}</p>
          )}
        </div>

        {/* Slogan  */}
        <div className="flex flex-col w-full space-y">
          <label
            htmlFor={`${index}-campaign_slogan`}
            className="text-sm text-gray-600 mr-2"
          >
            {t("slogan")}
          </label>

          <textarea
            className="border border-gray-300 rounded-md"
            defaultValue={field.slogan}
            {...register(`campaigns.${index}.slogan` as const, {
              required: true,
              maxLength: 200,
            })}
          />
          {`errors.campaigns.${index}.slogan.type` === "required" && (
            <p>{t("input_required")}</p>
          )}
          {`errors.campaigns.${index}.slogan.type` === "maxLength" && (
            <p>{t("error_200_max_length")}</p>
          )}
        </div>

        {/* Goal  */}
        <div className="flex flex-col w-full space-y">
          <label
            htmlFor={`${index}-campaign_goal`}
            className="text-sm text-gray-600 mr-2"
          >
            {t("goal")}
          </label>

          <textarea
            className="border border-gray-300 rounded-md"
            defaultValue={field.goal}
            {...register(`campaigns.${index}.goal` as const, {
              required: true,
              maxLength: 200,
            })}
          />
          {`errors.campaigns.${index}.goal.type` === "required" && (
            <p>{t("input_required")}</p>
          )}
          {`errors.campaigns.${index}.goal.type` === "maxLength" && (
            <p>{t("error_200_max_length")}</p>
          )}
        </div>

        {/* Status  */}
        <div className="flex flex-col w-full space-y">
          <label
            htmlFor={`${index}-campaign_status`}
            className="text-sm text-gray-600 mr-2"
          >
            {t("status")}
          </label>

          <input
            className="border border-gray-300 rounded-md"
            defaultValue={field.status}
            {...register(`campaigns.${index}.status` as const, {
              required: true,
            })}
          />
          {`errors.campaigns.${index}.status.type` === "required" && (
            <p>{t("input_required")}</p>
          )}
        </div>

        {/* Start Date  */}
        <div className="flex flex-col w-full space-y">
          <label
            htmlFor={`${index}-campaign_start_date`}
            className="text-sm text-gray-600 mr-2"
          >
            {t("start_date")}
          </label>

          <input
            type={"date"}
            className="border border-gray-300 rounded-md"
            defaultValue={field.start_date.toString()}
            {...register(`campaigns.${index}.start_date` as const)}
          />
          {`errors.campaigns.${index}.start_date.type` === "required" && (
            <p>{t("input_required")}</p>
          )}
        </div>

        {/* End Date  */}
        <div className="flex flex-col w-full space-y">
          <label
            htmlFor={`${index}-campaign_end_date`}
            className="text-sm text-gray-600 mr-2"
          >
            {t("end_date")}
          </label>

          <input
            type={"date"}
            className="border border-gray-300 rounded-md"
            defaultValue={field.end_date.toString()}
            {...register(`campaigns.${index}.end_date` as const)}
          />
          {`errors.awards.${index}.end_date.type` === "required" && (
            <p>{t("input_required")}</p>
          )}
        </div>

        <div className="flex flex-col w-full space-y">
          <Button
            class="w-[44vw] px-4 py-2 text-xl"
            primary
            onClick={() => handleShowProductsInCampaignModal(true, index)}
          >
            {t("configure_products_in_campaign")}
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            class=""
            large
            primary
            onClick={() => api_handleSaveCampaign(index)}
          >
            {t("save_form_campaign")}
          </Button>

          <Button
            danger
            medium
            class=""
            onClick={() => {
              handleDeleteShowModal(true, index);
            }}
          >
            {t("delete")}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
