import SelectInput from "../common/SelectInput";
import React, { useEffect, useState } from "react";
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
  ModalAddProductFormData,
} from "../../../../lib/types";
import { Button } from "../common/Button";
import { DeleteButton } from "../common/DeleteButton";
import { FilePreviewImageMultimedia } from "../common/FilePreviewImageMultimedia";
import { InfoTooltip } from "../common/InfoTooltip";
import { capitalizeFirstLetter } from "../../../../utils/formatWords";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { DisplayInputError } from "../common/DisplayInputError";

interface Props {
  form: UseFormReturn<ModalAddProductFormData, any>;
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
    setValue,
    trigger,
  } = form;

  const [volume, setVolume] = useState<number>(0);
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

    // setColorOptions(newSet);
  }, [customizeSettings.colors]);

  useEffect(() => {
    const famStyleSettings = customizeSettings.family_styles.map((famStyle) => {
      return { label: capitalizeFirstLetter(famStyle), value: famStyle };
    });
    const newSet = [...family_options, ...famStyleSettings];

    // setFamStyleOptions(newSet);
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

    setValue("category", category);
  };

  const handleRemovePack = (index: number) => {
    remove(index);
  };

  const handleAddPack = () => {
    append(emptyPack);
  };

  const handleSelectVolume = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVolume(parseInt(e.target.value));
    setValue("volume", parseInt(e.target.value));
    trigger("volume");
  };

  return (
    <>
      {/* Select product type  */}
      <section className="relative flex-auto pt-6">
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
            defaultValue={product_type_options[0].value}
            className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          >
            {product_type_options.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.value.toLowerCase())}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Beer type */}
      {isBeer && (
        <div className="relative flex-auto space-y-4 pt-6">
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

              {errors.name && (
                <DisplayInputError message={errors.name.message} />
              )}
            </div>
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

              {errors.description && (
                <DisplayInputError message={errors.description.message} />
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

          {/* Color  */}
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

          {/* Family  */}
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

              {/*
              TODO: Volver aqui para ver por qué está famStyleOptions
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
                {...register("family", {
                  required: true,
                  valueAsNumber: true,
                })}
                defaultValue={family_options[0].value}
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
              )} */}
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

          {/* Aroma  */}
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

              {errors.format && (
                <DisplayInputError message={errors.format.message} />
              )}
            </div>

            <div className="space-y w-full">
              <label htmlFor="volume" className="text-sm text-gray-600">
                {t("volume_label")}
              </label>

              <select
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                id="volume"
                {...register(`volume`, {
                  valueAsNumber: true,
                  required: true,
                })}
                onChange={(e) => {
                  handleSelectVolume(e);
                }}
                value={volume}
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
                {t("price")} €
              </label>

              <input
                id="price"
                type="number"
                placeholder={formatCurrency(2.5)}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                min="0"
                {...register(`price`, {
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
                    {...register(`stock_quantity`, {
                      required: true,
                      min: 0,
                      valueAsNumber: true,
                    })}
                  />

                  {errors.stock_quantity && (
                    <DisplayInputError
                      message={errors.stock_quantity.message}
                    />
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
                      valueAsNumber: true,
                    })}
                  />

                  {errors.stock_limit_notification && (
                    <DisplayInputError
                      message={errors.stock_limit_notification.message}
                    />
                  )}
                </div>
              </div>

              {/* <Divider /> */}

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
                          {...register(`packs.${index}.quantity` as const, {
                            valueAsNumber: true,
                          })}
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
                            valueAsNumber: true,
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
