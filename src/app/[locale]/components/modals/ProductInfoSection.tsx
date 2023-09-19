import React, { useEffect, useState } from "react";
import { Divider } from "@supabase/ui";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
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
} from "../../../../lib/beerEnum";
import {
  ICustomizeSettings,
  IProductPack,
  ModalAddProductProps,
} from "../../../../lib/types.d";
import { Button } from "../common/Button";
import { DeleteButton } from "../common/DeleteButton";
import { FilePreviewImageMultimedia } from "../common/FilePreviewImageMultimedia";
import { InfoTooltip } from "../common/InfoTooltip";
import { capitalizeFirstLetter } from "../../../../utils/formatWords";
import { formatCurrency } from "../../../../utils/formatCurrency";

interface Props {
  form: UseFormReturn<ModalAddProductProps, any>;
  customizeSettings: ICustomizeSettings;
}

const emptyPack: IProductPack = {
  id: "",
  created_at: "",
  quantity: 6,
  price: 0,
  img_url: "",
  name: "",
  randomUUID: "",
  product_id: "",
};

export function ProductInfoSection({ form, customizeSettings }: Props) {
  const t = useTranslations();

  const {
    register,
    formState: { errors },
    control,
  } = form;

  const [isBeer, setIsBeer] = useState(true);
  const [isMerchandising, setIsMerchandising] = useState(false);
  const [colorOptions, setColorOptions] = useState(color_options);
  const [famStyleOptions, setFamStyleOptions] = useState(family_options);
  const [formatOptions, setFormatOptions] = useState<string>(
    format_options[0].label
  );

  const { fields, append, remove } = useFieldArray({
    name: "packs",
    control,
  });

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

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormatOptions(event.target.value);
  };

  // Function that switch between merchandising and beer when select option is clicked
  const handleProductType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value.toLowerCase();
    if (category === "beer") {
      setIsBeer(true);
      setIsMerchandising(false);
    } else if (category === "merchandising") {
      setIsBeer(false);
      setIsMerchandising(true);
    }

    form.setValue("category", category);
  };

  const handleRemovePack = (index: number) => {
    remove(index);
  };

  const handleAddPack = () => {
    append(emptyPack);
  };

  return (
    <>
      {/* Select product type  */}
      <div className="relative flex-auto pt-6">
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
            className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
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
        <div className="relative flex-auto space-y-4 pt-6">
          <Divider />

          <p className="text-slate-500 my-4 text-xl leading-relaxed">
            {t("modal_product_add_details_title")}
          </p>

          {/* Name & Campaign  */}
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
              {errors.name?.type === "required" && (
                <p>{t("errors.input_required")}</p>
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

          {/* Description  */}
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
              {errors.description?.type === "required" && (
                <p>{t("errors.input_required")}</p>
              )}
              {errors.description?.type === "maxLength" && (
                <p>{t("product_modal_20_max_length")}</p>
              )}
            </div>
          </div>

          {/* Intensity & Fermentation  */}
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
                <p>{t("errors.input_required")}</p>
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

                <InfoTooltip
                  content={`${t("fermentation_tooltip")}`}
                  delay={0}
                  width={600}
                />
              </label>

              <select
                {...register("fermentation", {
                  required: true,
                })}
                defaultValue={fermentation_options[0].label}
                id="fermentation"
                className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {fermentation_options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
              {errors.fermentation?.type === "required" && (
                <p>{t("errors.input_required")}</p>
              )}
            </div>
          </div>

          {/* Color  */}
          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="color" className="text-sm text-gray-600">
                {t("color")}
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
                className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
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
                className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {origin_options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
              {errors.origin?.type === "required" && (
                <p>{t("errors.input_required")}</p>
              )}
            </div>
          </div>

          {/* Family  */}
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
                className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {famStyleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>

              {errors.family?.type === "required" && (
                <p>{t("errors.input_required")}</p>
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
                className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {era_options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
              {errors.era?.type === "required" && (
                <p>{t("errors.input_required")}</p>
              )}
            </div>
          </div>

          {/* Aroma  */}
          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="aroma" className="text-sm text-gray-600">
                {t("aroma")}
                <InfoTooltip
                  content={`${t("aroma_tooltip")}`}
                  delay={0}
                  width={600}
                />
              </label>

              <select
                id="aroma"
                {...register("aroma")}
                defaultValue={aroma_options[0].label}
                className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
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

          {/* Is Gluten  */}
          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="isGluten" className="text-sm text-gray-600">
                {t("isGluten")}
              </label>

              <select
                id="isGluten"
                {...register("is_gluten")}
                defaultValue="false"
                className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                <option key={0} value={"false"}>
                  {t("no")}
                </option>
                <option key={1} value={"true"}>
                  {t("yes")}
                </option>
              </select>
              {errors.is_gluten?.type === "required" && (
                <p>{t("errors.input_required")}</p>
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
                  value: formatOptions,
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

              {errors.format?.type === "required" && (
                <p>{t("errors.input_required")}</p>
              )}
            </div>

            <div className="space-y w-full">
              <label htmlFor="volume" className="text-sm text-gray-600">
                {t("volume_label")}
              </label>

              <select
                {...register(`volume`)}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                value={"330"}
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

              {errors.volume?.type === "required" && (
                <p>{t("errors.input_required")}</p>
              )}
            </div>
          </div>

          {/* Individual Price  */}
          <div className="flex w-full flex-row space-x-3 ">
            <div className="w-full ">
              <label htmlFor="price" className="text-sm text-gray-600">
                {t("price")} €
              </label>

              <input
                id="price"
                type="number"
                placeholder={formatCurrency(2.5)}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                min="0"
                {...register(`price`, { required: true, min: 0 })}
              />

              {errors.price?.type === "required" && (
                <p>{t("errors.input_required")}</p>
              )}

              {errors.price?.type === "min" && (
                <p>{t("error_0_number_min_length")}</p>
              )}
            </div>
          </div>

          <Divider />

          {/* Stock information  */}
          <div className="container mt-4">
            <p className="text-slate-500 my-4 text-xl leading-relaxed">
              {t("modal_product_add_price_title")}
            </p>

            <div className="flex w-full flex-col space-y-4 ">
              {/* Stock quantity and Limitation */}
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
                    <p>{t("errors.input_required")}</p>
                  )}
                  {errors.stock_quantity?.type === "min" && (
                    <p>{t("product_modal_min_0")}</p>
                  )}
                </div>

                <div className="w-full">
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
                    <p>{t("errors.input_required")}</p>
                  )}
                  {errors.stock_limit_notification?.type === "min" && (
                    <p>{t("product_modal_min_0")}</p>
                  )}
                </div>
              </div>

              <Divider />

              {/* Packs  */}
              <div className="flex flex-col space-y-2">
                <span className="text-lg ">{t("add_product_pack")}</span>

                <span className="text-sm ">
                  {t("add_product_pack_description")}
                </span>
              </div>

              {fields.map((field, index) => (
                <fieldset
                  className="border border-solid border-gray-300 p-3"
                  key={field.id}
                >
                  <div className="space-y w-full">
                    {/* Quantity and price  */}
                    <div className="flex w-full flex-row items-end space-x-3">
                      <div className="w-full">
                        <label
                          htmlFor={`packs.${index}.pack`}
                          className="text-sm text-gray-600"
                        >
                          {t("pack_quantity")} nº {index + 1}
                        </label>

                        <select
                          required
                          id={`packs.${index}.quantity`}
                          {...register(`packs.${index}.quantity` as const)}
                          className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                        >
                          {pack_type_options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.value}
                            </option>
                          ))}
                        </select>

                        {`errors.packs.${index}.pack.type` === "required" && (
                          <p>{t("errors.input_required")}</p>
                        )}
                      </div>

                      <div className="w-full">
                        <label
                          htmlFor={`packs.${index}.price`}
                          className="text-sm text-gray-600"
                        >
                          {t("pack_price")} €
                        </label>

                        <input
                          id="price"
                          type="number"
                          placeholder={formatCurrency(2.5)}
                          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                          required
                          min="0"
                          {...register(`packs.${index}.price` as const, {
                            required: true,
                            min: 0,
                          })}
                        />

                        {`errors.packs.${index}.price.type` === "required" && (
                          <p>{t("errors.input_required")}</p>
                        )}
                        {`errors.packs.${index}.price.type` === "min" && (
                          <p>{t("product_modal_min_0")}</p>
                        )}
                      </div>
                    </div>

                    {/* Pack name and Pack Photo Optional  */}
                    <div className="flex w-full flex-row items-end space-x-3 space-y-2">
                      <div className="w-full">
                        <label
                          htmlFor={`packs.${index}.name`}
                          className="text-sm text-gray-600"
                        >
                          {t("pack_name")}
                        </label>

                        <input
                          id={`packs.${index}.name`}
                          type="text"
                          placeholder={`Pack ${index + 1}`}
                          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                          defaultValue={1}
                          required
                          min="0"
                          {...register(`packs.${index}.name` as const, {
                            required: true,
                          })}
                        />

                        {`packs.${index}.name.type` === "required" && (
                          <p>{t("errors.input_required")}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex w-full flex-row items-end space-x-3 space-y-2">
                      <div className="w-full">
                        <label
                          htmlFor={`packs.${index}.img_url`}
                          className="text-sm text-gray-600"
                        >
                          {t("pack_img_url")}
                        </label>

                        <FilePreviewImageMultimedia
                          form={form}
                          registerName={`packs.${index}.img_url`}
                        />
                      </div>

                      {/* Delete BTN  */}
                      <div className="flex-grow-0">
                        <DeleteButton onClick={() => handleRemovePack(index)} />
                      </div>
                    </div>
                  </div>
                </fieldset>
              ))}

              <Button class="" primary medium onClick={() => handleAddPack()}>
                {t("add_pack")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Merchandising type */}
      {isMerchandising && <> </>}
    </>
  );
}
