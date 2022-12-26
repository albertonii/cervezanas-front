import React, { useState } from "react";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  aroma_options,
  color_options,
  era_options,
  family_options,
  fermentation_options,
  format_options,
  intensity_options,
  origin_options,
  pack_type_options,
  product_type_options,
  volume_can_type_options,
  volume_draft_type_options,
  volume_glass_type_options,
} from "../../lib/beerEnum";
import { Award } from "../../types";

interface FormProps {
  is_public: boolean;
  name: string;
  description: string;
  campaign: string;
  type: number;
  color: number;
  intensity: number;
  aroma: number;
  family: number;
  fermentation: number;
  origin: number;
  era: number;
  format: number;
  isGluten: string;
  awards: Award[];
  p_principal: any;
  p_back: any;
  p_extra_1: any;
  p_extra_2: any;
  p_extra_3: any;
  volume: number;
  price: number;
  pack: string;
}

interface Props {
  form: UseFormReturn<FormProps, any>;
}

const campaigns = [
  {
    label: "None",
    value: "-",
  },
  {
    label: "Campaign 1",
    value: "campaign_1",
  },
  {
    label: "Campaign 2",
    value: "campaign_2",
  },
];

export default function ProductInfoSection({
  form: {
    control,
    register,
    formState: { errors },
  },
}: Props) {
  const { t } = useTranslation();

  const [containerFormat, setContainerFormat] = useState(
    format_options[0].label
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setContainerFormat(event.target.value);
  };

  const renderSwitch = () => {
    switch (containerFormat) {
      case "can":
        return (
          <select
            {...register("volume")}
            defaultValue={volume_can_type_options[0].label}
            className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {volume_can_type_options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value} (ML)
              </option>
            ))}
          </select>
        );
      case "glass":
        return (
          <select
            {...register("volume")}
            defaultValue={volume_glass_type_options[0].label}
            className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {volume_glass_type_options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value} (ML)
              </option>
            ))}
          </select>
        );
      case "draft":
        return (
          <select
            {...register("volume")}
            defaultValue={volume_draft_type_options[0].label}
            className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {volume_draft_type_options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value} (L)
              </option>
            ))}
          </select>
        );
    }
  };

  return (
    <>
      <div className="relative p-6 flex-auto">
        <p className="my-4 text-slate-500 text-lg leading-relaxed">
          {t("modal_product_add_details_title")}
        </p>

        <div className="w-full">
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              {...register("is_public")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {t("is_public")}
            </span>
          </label>
        </div>

        <div className="w-full">
          <label htmlFor="product_type" className="text-sm text-gray-600">
            {t("product_type")}
          </label>

          <select
            {...register("type")}
            defaultValue={product_type_options[0].label}
            className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {product_type_options.map((option) => (
              <option key={option.label} value={option.label}>
                {t(option.value)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full space-y">
            <label htmlFor="product_name" className="text-sm text-gray-600">
              {t("product_name")}
            </label>
            <input
              type="text"
              id="name"
              placeholder="IPA Jaira"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              {...register("name", {
                required: true,
              })}
            />
            {errors.name?.type === "required" && (
              <p>Campo nombre es requerido</p>
            )}
            {errors.name?.type === "maxLength" && (
              <p>Nombre debe tener menos de 20 caracteres</p>
            )}
          </div>

          <div className="w-full ">
            <label htmlFor="campaign" className="text-sm text-gray-600">
              {t("select_campaign")}
            </label>

            <select
              {...register("campaign")}
              value={""}
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {campaigns.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full space-y">
            <label htmlFor="description" className="text-sm text-gray-600">
              {t("product_description")}
            </label>
            <textarea
              id="description"
              placeholder=""
              value="Product description"
              className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              {...register("description", {
                required: true,
              })}
            />
            {errors.description?.type === "required" && (
              <p>Campo descripción es requerido</p>
            )}
            {errors.description?.type === "maxLength" && (
              <p>Nombre debe tener menos de 20 caracteres</p>
            )}
          </div>
        </div>

        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full ">
            <label htmlFor="intensity" className="text-sm text-gray-600">
              {t("intensity")}
            </label>

            <select
              {...register("intensity")}
              defaultValue={intensity_options[0].label}
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {intensity_options.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>

            {errors.intensity?.type === "required" && (
              <p>Campo intensidad requerido</p>
            )}
          </div>

          <div className="w-full ">
            <label htmlFor="fermentation" className="text-sm text-gray-600">
              {t("fermentation")}
            </label>

            <select
              {...register("fermentation")}
              defaultValue={fermentation_options[0].label}
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {fermentation_options.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>
            {errors.fermentation?.type === "required" && (
              <p>Campo fementación requerido</p>
            )}
          </div>
        </div>

        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full ">
            <label htmlFor="color" className="text-sm text-gray-600">
              {t("color")}
            </label>

            <select
              {...register("color")}
              defaultValue={color_options[0].label}
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {color_options.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>

            {errors.color?.type === "required" && <p>Campo color requerido</p>}
          </div>

          <div className="w-full ">
            <label htmlFor="origin" className="text-sm text-gray-600">
              {t("origin")}
            </label>

            <select
              {...register("origin")}
              defaultValue={origin_options[0].label}
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {origin_options.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>
            {errors.origin?.type === "required" && (
              <p>Campo origen requerido</p>
            )}
          </div>
        </div>

        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full ">
            <label htmlFor="family" className="text-sm text-gray-600">
              {t("family")}
            </label>

            <select
              {...register("family")}
              defaultValue={family_options[0].label}
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {family_options.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>

            {errors.family?.type === "required" && (
              <p>Campo familia de estilo requerido</p>
            )}
          </div>

          <div className="w-full ">
            <label htmlFor="era" className="text-sm text-gray-600">
              {t("era")}
            </label>

            <select
              {...register("era")}
              defaultValue={era_options[0].label}
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {era_options.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>
            {errors.intensity?.type === "required" && (
              <p>Campo era requerido</p>
            )}
          </div>
        </div>

        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full ">
            <label htmlFor="aroma" className="text-sm text-gray-600">
              {t("aroma")}
            </label>

            <select
              {...register("aroma")}
              defaultValue={aroma_options[0].label}
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {aroma_options.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>

            {errors.aroma?.type === "required" && <p>Campo aroma requerido</p>}
          </div>
        </div>

        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full ">
            <label htmlFor="isGluten" className="text-sm text-gray-600">
              {t("isGluten")}
            </label>

            <select
              {...register("isGluten")}
              defaultValue="false"
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option key={0} value={"false"}>
                {t("no")}
              </option>
              <option key={1} value={"true"}>
                {t("yes")}
              </option>
            </select>
            {errors.isGluten?.type === "required" && (
              <p>Campo de gluten requerido</p>
            )}
          </div>
        </div>
      </div>

      <div className="relative p-6 flex-auto">
        <p className="my-4 text-slate-500 text-lg leading-relaxed">
          {t("modal_product_add_price_title")}
        </p>

        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full ">
            <label htmlFor="format" className="text-sm text-gray-600">
              {t("format")}
            </label>

            <select
              {...register("format")}
              defaultValue={format_options[0].label}
              onChange={handleChange}
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {format_options.map((option) => (
                <option key={option.value} value={option.label}>
                  {t(option.label)}
                </option>
              ))}
            </select>
            {errors.format?.type === "required" && (
              <p>Campo formato requerido</p>
            )}
          </div>

          <div className="w-full space-y">
            <label htmlFor="volume" className="text-sm text-gray-600">
              {t("volume_label")}
            </label>

            {renderSwitch()}

            {errors.name?.type === "required" && <p>Campo volumen requerido</p>}
          </div>
        </div>
        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full ">
            <label htmlFor="pack" className="text-sm text-gray-600">
              {t("pack_label")}
            </label>

            <select
              {...register("pack")}
              defaultValue={pack_type_options[0].label}
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {pack_type_options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>

            {errors.pack?.type === "required" && <p>Campo packs requerido</p>}
          </div>

          <div className="w-full ">
            <label htmlFor="price" className="text-sm text-gray-600">
              {t("price_label")}
            </label>

            <input
              type="number"
              placeholder="2.5"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              {...register("price", {
                required: true,
              })}
            />

            {errors.price?.type === "required" && <p>Campo precio requerido</p>}
          </div>
        </div>
      </div>
    </>
  );
}
