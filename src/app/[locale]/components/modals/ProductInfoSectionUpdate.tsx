"use client";

import SelectInput from "../common/SelectInput";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  aroma_options,
  color_options,
  era_options,
  family_options,
  fermentation_options,
  format_options,
  origin_options,
  product_type_options,
  volume_can_type_options,
  volume_draft_type_options,
  volume_bottle_type_options,
} from "../../../../lib/beerEnum";
import { InfoTooltip } from "../common/InfoTooltip";
import { ModalUpdateProductFormData } from "../../../../lib/types";
import { DisplayInputError } from "../common/DisplayInputError";
import StockInformationDetailsAndPacksUpdate from "./StockInformationDetailsAndPacksUpdate";

interface Props {
  form: UseFormReturn<ModalUpdateProductFormData, any>;
}

export function ProductInfoSectionUpdate({ form }: Props) {
  const t = useTranslations();

  const {
    register,
    formState: { errors },
    getValues,
  } = form;

  const [formatOptions, setFormatOptions] = useState<string>(
    format_options[0].label
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormatOptions(event.target.value);
  };

  return (
    <>
      {/* Select product type  */}
      <section className="relative flex-auto space-y-4 pt-6">
        <div className="flex w-full flex-col items-end justify-end">
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
              defaultChecked={getValues("is_public")}
            />

            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-beer-blonde peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beer-softFoam dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-beer-blonde"></div>

            <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300">
              {t("is_public")}
            </span>
          </label>

          <span className="mt-2 text-sm font-medium text-gray-400 dark:text-gray-300">
            {t("is_public_description")}
          </span>
        </div>

        <div className="w-full pt-6">
          <label htmlFor="product_type" className="text-sm text-gray-600">
            {t("product_type")}
          </label>

          <select
            id="product_type"
            defaultValue={getValues("type") ?? "BEER"}
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 hover:cursor-not-allowed hover:bg-gray-200 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            disabled
          >
            {product_type_options.map((option) => (
              <option key={option.label} value={option.label}>
                {t(option.value.toLowerCase())}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Beer type */}
      {getValues("type") === "BEER" && (
        <section className="relative flex-auto space-y-4 pt-6">
          <p className="text-slate-500 my-4 text-xl leading-relaxed">
            {t("modal_product_add_details_title")}
          </p>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="space-y w-full">
              <label htmlFor="product_name" className="text-sm text-gray-600">
                {t("product_name")}
              </label>

              <input
                type="text"
                id="product_name"
                placeholder="IPA Jaira"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register("name", {
                  required: true,
                })}
              />

              {errors.name && (
                <DisplayInputError message={errors.name.message} />
              )}
            </div>
            {/* 
            <div className="w-full ">
              <label htmlFor="campaign" className="text-sm text-gray-600">
                {t("select_campaign")}
              </label>

              <select
                {...register("campaign")}
                value={""}
                className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {campaigns.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div> */}
          </div>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="space-y w-full">
              <label htmlFor="description" className="text-sm text-gray-600">
                {t("product_description")}
              </label>

              <textarea
                id="description"
                placeholder="IPA Jaira is a beer with a strong and intense aroma, with a fruity and floral touch."
                className="min-h-20 relative block max-h-56 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register("description", {
                  required: true,
                })}
              />

              {errors.description && (
                <DisplayInputError message={errors.description.message} />
              )}
            </div>
          </div>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="intensity" className="text-sm text-gray-600">
                {t("intensity")} (%)
                <InfoTooltip
                  content={`${t("intensity_tooltip")}`}
                  delay={0}
                  width={600}
                />
              </label>

              <input
                id="intensity"
                type="number"
                placeholder="4.7"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                defaultValue={0}
                min="0"
                max="100"
                {...register(`intensity`, {
                  required: true,
                  min: 0,
                  max: 100,
                  valueAsNumber: true,
                })}
              />

              {errors.intensity && (
                <DisplayInputError message={errors.intensity.message} />
              )}
            </div>

            <div className="w-full ">
              <SelectInput
                form={form}
                hasInfoTooltip={true}
                labelTooltip={"fermentation_tooltip"}
                options={fermentation_options}
                label={"fermentation"}
                registerOptions={{
                  required: true,
                  valueAsNumber: true,
                }}
              />

              {errors.fermentation && (
                <DisplayInputError message={errors.fermentation.message} />
              )}
            </div>
          </div>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <SelectInput
                form={form}
                hasInfoTooltip={true}
                labelTooltip={"color_tooltip"}
                options={color_options}
                label={"color"}
                registerOptions={{
                  required: true,
                  valueAsNumber: true,
                }}
              />

              {errors.color && (
                <DisplayInputError message={errors.color.message} />
              )}
            </div>

            <div className="w-full ">
              <SelectInput
                form={form}
                hasInfoTooltip={true}
                labelTooltip={"origin_tooltip"}
                options={origin_options}
                label={"origin"}
                registerOptions={{
                  required: true,
                  valueAsNumber: true,
                }}
              />

              {errors.origin && (
                <DisplayInputError message={errors.origin.message} />
              )}
            </div>
          </div>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <SelectInput
                form={form}
                hasInfoTooltip={true}
                labelTooltip={"family_tooltip"}
                options={family_options}
                label={"family"}
                registerOptions={{
                  required: true,
                  valueAsNumber: true,
                }}
              />

              {errors.family && (
                <DisplayInputError message={errors.family.message} />
              )}
            </div>

            <div className="w-full ">
              <SelectInput
                form={form}
                hasInfoTooltip={true}
                labelTooltip={"era_tooltip"}
                options={era_options}
                label={"era"}
                registerOptions={{
                  required: true,
                  valueAsNumber: true,
                }}
              />

              {errors.intensity && (
                <DisplayInputError message={errors.intensity.message} />
              )}
            </div>
          </div>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <SelectInput
                form={form}
                hasInfoTooltip={true}
                labelTooltip={"aroma_tooltip"}
                options={aroma_options}
                label={"aroma"}
                registerOptions={{
                  required: true,
                  valueAsNumber: true,
                }}
              />

              {errors.aroma && (
                <DisplayInputError message={errors.aroma.message} />
              )}
            </div>
          </div>

          {/* Is Gluten  */}
          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="isGluten" className="text-sm text-gray-600">
                {t("isGluten")}
              </label>

              <select
                id="isGluten"
                {...register("is_gluten", {
                  required: true,
                })}
                className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                <option key={0} value={"false"}>
                  {t("no")}
                </option>
                <option key={1} value={"true"}>
                  {t("yes")}
                </option>
              </select>

              {errors.is_gluten && (
                <DisplayInputError message={errors.is_gluten.message} />
              )}
            </div>
          </div>

          {/* Format & Volume  */}
          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="format" className="text-sm text-gray-600">
                {t("format")}
              </label>

              <select
                id="format"
                {...register("format", {
                  value: getValues("format"),
                })}
                onChange={handleChange}
                className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {format_options.map((option) => (
                  <option key={option.value} value={option.label}>
                    {t(option.label)}
                  </option>
                ))}
              </select>

              {errors.format && (
                <DisplayInputError message={errors.format.message} />
              )}
            </div>

            <div className="space-y w-full">
              <label htmlFor="volume" className="text-sm text-gray-600">
                {t("volume_label")}
              </label>

              <select
                {...register(`volume`)}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {formatOptions === "can" ? (
                  <>
                    {volume_can_type_options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value} (ML)
                      </option>
                    ))}
                  </>
                ) : formatOptions === "bottle" ? (
                  <>
                    {volume_bottle_type_options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value} (ML)
                      </option>
                    ))}
                  </>
                ) : (
                  <>
                    {volume_draft_type_options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value} (L)
                      </option>
                    ))}
                  </>
                )}
              </select>

              {errors.volume && (
                <DisplayInputError message={errors.volume.message} />
              )}
            </div>
          </div>

          {/* Individual Price  */}
          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="price" className="text-sm text-gray-600">
                {t("price")} (€)
              </label>

              <input
                id="price"
                type="number"
                placeholder="4.7"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                min="0"
                {...register(`price`, {
                  value: getValues("price"),
                  required: true,
                  min: 0,
                  valueAsNumber: true,
                })}
              />

              {errors.price && (
                <DisplayInputError message={errors.price.message} />
              )}
            </div>
          </div>

          {/* <Divider /> */}

          {/* Stock information and Packs */}
          <StockInformationDetailsAndPacksUpdate form={form} />
        </section>
      )}

      {/* Merchandising type */}
      {getValues("type") === "MERCHANDISING" && <> </>}
    </>
  );
}
