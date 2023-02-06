import React, { useState } from "react";
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
  volume_bottle_type_options,
} from "../../lib/beerEnum";
import { ModalAddProductProps } from "../../lib/types";

interface Props {
  form: UseFormReturn<ModalAddProductProps, any>;
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
    register,
    formState: { errors },
  },
}: Props) {
  const { t } = useTranslation();

  const [isBeer, setIsBeer] = useState(false);
  const [isMerchandising, setIsMerchandising] = useState(false);

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
            defaultValue={volume_can_type_options[0].value}
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
            defaultValue={volume_bottle_type_options[0].value}
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

  const handleProductType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "beer") {
      setIsBeer(true);
      setIsMerchandising(false);
    } else if (event.target.value === "merchandising") {
      setIsMerchandising(true);
      setIsBeer(false);
    } else {
      setIsBeer(false);
      setIsMerchandising(false);
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
            className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          >
            {product_type_options.map((option) => (
              <option
                key={option.label}
                value={option.label}
                onClick={() => handleProductType}
              >
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
              {t("intensity")}
            </label>

            <select
              {...register("intensity")}
              defaultValue={intensity_options[0].label}
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            >
              {intensity_options.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>

            {errors.intensity?.type === "required" && (
              <p>{t("product_modal_required")}</p>
            )}
          </div>

          <div className="w-full ">
            <label htmlFor="fermentation" className="text-sm text-gray-600">
              {t("fermentation")}
            </label>

            <select
              {...register("fermentation")}
              defaultValue={fermentation_options[0].label}
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
              {t("color")}
            </label>

            <select
              {...register("color")}
              defaultValue={color_options[0].label}
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
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
            </label>

            <select
              {...register("family")}
              defaultValue={family_options[0].label}
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            >
              {family_options.map((option) => (
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
            <label htmlFor="era" className="text-sm text-gray-600">
              {t("era")}
            </label>

            <select
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
            {errors.intensity?.type === "required" && (
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

            {errors.aroma?.type === "required" && <p>Campo aroma requerido</p>}
          </div>
        </div>

        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full ">
            <label htmlFor="isGluten" className="text-sm text-gray-600">
              {t("isGluten")}
            </label>

            <select
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
      </div>

      <div className="relative p-6 flex-auto">
        <p className="my-4 text-slate-500 text-lg leading-relaxed">
          {t("modal_product_add_price_title")}
        </p>

        <div className="container">
          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="format" className="text-sm text-gray-600">
                {t("format")}
              </label>

              <select
                {...register("format")}
                defaultValue={format_options[0].label}
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

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="pack" className="text-sm text-gray-600">
                {t("pack_label")}
              </label>

              <select
                {...register(`pack`)}
                defaultValue={pack_type_options[0].value}
                className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
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

          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="stockQuantity" className="text-sm text-gray-600">
                {t("stock_quantity_label")}
              </label>

              <input
                type="number"
                placeholder="500"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                min="0"
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
                type="number"
                placeholder="20"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                min="0"
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

    </>
  );
}
