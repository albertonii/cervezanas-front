import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  aroma_options,
  color_options,
  era_options,
  family_options,
  fermentation_options,
  format_options,
  origin_options,
  pack_type_options,
  product_type_options,
  volume_can_type_options,
  volume_draft_type_options,
  volume_bottle_type_options,
} from "../../lib/beerEnum";
import { CustomizeSettings, ModalAddProductProps } from "../../lib/types";
import { capitalizeFirstLetter } from "../../utils";
import { InfoTooltip } from "../common";

interface Props {
  form: UseFormReturn<ModalAddProductProps, any>;
  customizeSettings: CustomizeSettings;
}

export function ProductInfoSection({
  form: {
    register,
    formState: { errors },
    getValues,
  },
  customizeSettings,
}: Props) {
  const { t } = useTranslation();

  const [isBeer, setIsBeer] = useState(true);
  const [isMerchandising, setIsMerchandising] = useState(false);
  const [colorOptions, setColorOptions] = useState(color_options);
  const [famStyleOptions, setFamStyleOptions] = useState(family_options);

  useEffect(() => {
    const colorSettings = customizeSettings.colors.map((color) => {
      return { label: capitalizeFirstLetter(color), value: color };
    });
    const newSet = [...color_options, ...colorSettings];

    setColorOptions(newSet);
  }, [customizeSettings.colors]);

  useEffect(() => {
    const famStyleSettings = customizeSettings.family_styles.map((famStyle) => {
      return { label: capitalizeFirstLetter(famStyle), value: famStyle };
    });
    const newSet = [...family_options, ...famStyleSettings];

    setFamStyleOptions(newSet);
  }, [customizeSettings.family_styles]);

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
            {...register(`volume`)}
            className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          >
            {volume_can_type_options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value} (ML)
              </option>
            ))}
          </select>
        );
      case "bottle":
        return (
          <select
            {...register(`volume`)}
            className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          >
            {volume_bottle_type_options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value} (ML)
              </option>
            ))}
          </select>
        );
      case "draft":
        return (
          <select
            {...register(`volume`)}
            defaultValue={volume_draft_type_options[0].value}
            className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
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

  // Function that switch between merchandising and beer when select option is clicked
  const handleProductType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "beer") {
      setIsBeer(true);
      setIsMerchandising(false);
    } else if (event.target.value === "merchandising") {
      setIsBeer(false);
      setIsMerchandising(true);
    }
  };

  return (
    <>
      {/* Select product type  */}
      <div className="relative pt-6 flex-auto">
        <div className="w-full flex flex-col items-end">
          <label
            className="inline-flex relative items-center cursor-pointer"
            htmlFor="is_public"
          >
            <input
              id="is_public"
              type="checkbox"
              value=""
              className="sr-only peer"
              {...register("is_public")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beer-softFoam dark:peer-focus:ring-beer-blonde rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-beer-blonde"></div>
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
            {...register("type")}
            onChange={handleProductType}
            defaultValue={product_type_options[0].label}
            className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          >
            {product_type_options.map((option) => (
              <option key={option.label} value={option.label}>
                {t(option.value.toLowerCase())}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Beer type */}
      {isBeer && (
        <div className="relative pt-6 flex-auto space-y-4">
          <p className="my-4 text-slate-500 text-xl leading-relaxed">
            {t("modal_product_add_details_title")}
          </p>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full space-y">
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
              {errors.name?.type === "required" && (
                <p>{t("product_modal_required")}</p>
              )}
              {errors.name?.type === "maxLength" && (
                <p>{t("product_modal_20_max_length")}</p>
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
            <div className="w-full space-y">
              <label htmlFor="description" className="text-sm text-gray-600">
                {t("product_description")}
              </label>

              <textarea
                id="description"
                placeholder="IPA Jaira is a beer with a strong and intense aroma, with a fruity and floral touch."
                className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register("description", {
                  required: true,
                })}
              />
              {errors.description?.type === "required" && (
                <p>{t("product_modal_required")}</p>
              )}
              {errors.description?.type === "maxLength" && (
                <p>{t("product_modal_20_max_length")}</p>
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
                {...register(`intensity`, { required: true, min: 0, max: 100 })}
              />

              {errors.intensity?.type === "required" && (
                <p>{t("product_modal_required")}</p>
              )}

              {errors.intensity?.type === "min" && (
                <p>{t("error_0_number_min_length")}</p>
              )}

              {errors.intensity?.type === "max" && (
                <p>{t("error_100_number_max_length")}</p>
              )}
            </div>

            <div className="w-full ">
              <label htmlFor="fermentation" className="text-sm text-gray-600">
                {t("fermentation")}
              </label>

              <select
                {...register("fermentation")}
                defaultValue={fermentation_options[0].label}
                id="fermentation"
                className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {fermentation_options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
              {errors.fermentation?.type === "required" && (
                <p>{t("product_modal_required")}</p>
              )}
            </div>
          </div>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="color" className="text-sm text-gray-600">
                {t("color")} (SRM)
                <InfoTooltip
                  content={`${t("color_tooltip")}`}
                  direction="top"
                  delay={200}
                  width={600}
                />
              </label>

              <select
                id="color"
                {...register("color")}
                defaultValue={color_options[0].label}
                className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {colorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>

              {errors.color?.type === "required" && (
                <p>Campo color requerido</p>
              )}
            </div>

            <div className="w-full ">
              <label htmlFor="origin" className="text-sm text-gray-600">
                {t("origin")}

                <InfoTooltip
                  content={`${t("origin_tooltip")}`}
                  direction="top"
                  delay={200}
                  width={300}
                />
              </label>

              <select
                id="origin"
                {...register("origin")}
                defaultValue={origin_options[0].label}
                className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {origin_options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
              {errors.origin?.type === "required" && (
                <p>{t("product_modal_required")}</p>
              )}
            </div>
          </div>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="family" className="text-sm text-gray-600">
                {t("family")}

                <InfoTooltip
                  content={`${t("family_tooltip")}`}
                  direction="top"
                  delay={200}
                  width={300}
                />
              </label>

              <select
                id="family"
                {...register("family")}
                defaultValue={family_options[0].label}
                className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {famStyleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>

              {errors.family?.type === "required" && (
                <p>{t("product_modal_required")}</p>
              )}
            </div>

            <div className="w-full ">
              <label
                htmlFor="era"
                className="text-sm text-gray-600 "
                data-tooltip-target="tooltip-default"
              >
                {t("era")}

                <InfoTooltip
                  content={`${t("era_tooltip")}`}
                  direction="top"
                  delay={200}
                  width={300}
                />
              </label>

              <select
                id="era"
                {...register("era")}
                defaultValue={era_options[0].label}
                className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {era_options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
              {errors.era?.type === "required" && (
                <p>{t("product_modal_required")}</p>
              )}
            </div>
          </div>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="aroma" className="text-sm text-gray-600">
                {t("aroma")}
              </label>

              <select
                id="aroma"
                {...register("aroma")}
                defaultValue={aroma_options[0].label}
                className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {aroma_options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>

              {errors.aroma?.type === "required" && (
                <p>Campo aroma requerido</p>
              )}
            </div>
          </div>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="isGluten" className="text-sm text-gray-600">
                {t("isGluten")}
              </label>

              <select
                id="isGluten"
                {...register("is_gluten")}
                defaultValue="false"
                className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                <option key={0} value={"false"}>
                  {t("no")}
                </option>
                <option key={1} value={"true"}>
                  {t("yes")}
                </option>
              </select>
              {errors.is_gluten?.type === "required" && (
                <p>{t("product_modal_required")}</p>
              )}
            </div>
          </div>

          {/* Stock information  */}
          <div className="container mt-4">
            <p className="my-4 text-slate-500 text-xl leading-relaxed">
              {t("modal_product_add_price_title")}
            </p>

            <div className="flex w-full flex-col space-y-4 ">
              {/* Format  */}
              <div className="flex w-full flex-row space-x-3 ">
                <div className="w-full ">
                  <label htmlFor="format" className="text-sm text-gray-600">
                    {t("format")}
                  </label>

                  <select
                    id="format"
                    {...register("format")}
                    defaultValue={"can"}
                    onChange={handleChange}
                    className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  >
                    {format_options.map((option) => (
                      <option key={option.value} value={option.label}>
                        {t(option.label)}
                      </option>
                    ))}
                  </select>
                  {errors.format?.type === "required" && (
                    <p>{t("product_modal_required")}</p>
                  )}
                </div>

                <div className="w-full space-y">
                  <label htmlFor="volume" className="text-sm text-gray-600">
                    {t("volume_label")}
                  </label>

                  {renderSwitch()}

                  {errors.volume?.type === "required" && (
                    <p>{t("product_modal_required")}</p>
                  )}
                </div>
              </div>

              {/* Pack  */}
              <div className="flex w-full flex-row space-x-3 ">
                <div className="w-full ">
                  <label htmlFor="pack" className="text-sm text-gray-600">
                    {t("pack_label")}
                  </label>

                  <select
                    id="pack"
                    {...register(`pack`)}
                    className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  >
                    {pack_type_options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </select>

                  {errors.pack?.type === "required" && (
                    <p>Campo packs requerido</p>
                  )}
                </div>

                <div className="w-full ">
                  <label htmlFor="price" className="text-sm text-gray-600">
                    {t("price_label")}
                  </label>

                  <input
                    id="price"
                    type="number"
                    placeholder="2.5"
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                    defaultValue={3}
                    min="0"
                    {...register(`price`, { required: true, min: 0 })}
                  />

                  {errors.price?.type === "required" && (
                    <p>{t("product_modal_required")}</p>
                  )}
                  {errors.price?.type === "min" && (
                    <p>{t("product_modal_min_0")}</p>
                  )}
                </div>
              </div>

              {/* Stock quantity  */}
              <div className="flex w-full flex-row space-x-3 ">
                <div className="w-full ">
                  <label
                    htmlFor="stockQuantity"
                    className="text-sm text-gray-600"
                  >
                    {t("stock_quantity_label")}
                  </label>

                  <input
                    id="stockQuantity"
                    type="number"
                    placeholder="500"
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                    min="0"
                    defaultValue={0}
                    {...register(`stock_quantity`, { required: true, min: 0 })}
                  />

                  {errors.stock_quantity?.type === "required" && (
                    <p>{t("product_modal_required")}</p>
                  )}
                  {errors.stock_quantity?.type === "min" && (
                    <p>{t("product_modal_min_0")}</p>
                  )}
                </div>

                <div className="w-full ">
                  <label
                    htmlFor="stockLimitNotification"
                    className="text-sm text-gray-600"
                  >
                    {t("stock_limit_notification_label")}
                  </label>

                  <input
                    id="stockLimitNotification"
                    type="number"
                    placeholder="20"
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                    min="0"
                    defaultValue={0}
                    {...register(`stock_limit_notification`, {
                      required: true,
                      min: 0,
                    })}
                  />

                  {errors.stock_limit_notification?.type === "required" && (
                    <p>{t("product_modal_required")}</p>
                  )}
                  {errors.stock_limit_notification?.type === "min" && (
                    <p>{t("product_modal_min_0")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Merchandising type */}
      {isMerchandising && <> </>}
    </>
  );
}
