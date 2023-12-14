import { useFieldArray, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import React from "react";
import { IProductPack, ModalAddProductFormData } from "../../../../lib/types";
import { FilePreviewImageMultimedia } from "../common/FilePreviewImageMultimedia";
import { DeleteButton } from "../common/DeleteButton";
import { Button } from "../common/Button";
import { pack_type_options } from "../../../../lib/beerEnum";
import { DisplayInputError } from "../common/DisplayInputError";
import { SupabaseProps } from "../../../../constants";

interface Props {
  form: UseFormReturn<ModalAddProductFormData, any>;
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

export default function StockInformationDetailsAndPacksAdd({ form }: Props) {
  const t = useTranslations();

  const preUrl =
    SupabaseProps.BASE_URL + SupabaseProps.STORAGE_PRODUCTS_IMG_URL;

  const {
    register,
    getValues,
    formState: { errors },
    control,
  } = form;

  const { fields, append, remove } = useFieldArray({
    name: "packs",
    control,
  });

  const handleRemovePack = async (index: number) => {
    remove(index);
  };

  const handleAddPack = () => {
    append(emptyPack);
  };

  return (
    <section className="container mt-4">
      <p className="text-slate-500 my-4 text-xl leading-relaxed">
        {t("modal_product_add_price_title")}
      </p>

      <div className="flex w-full flex-col space-y-4 ">
        {/* Stock quantity and Limitation */}
        <div className="flex w-full flex-row space-x-3 ">
          <div className="w-full ">
            <label htmlFor="stockQuantity" className="text-sm text-gray-600">
              {t("stock_quantity_label")}
            </label>

            <input
              id="stockQuantity"
              type="number"
              placeholder="500"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              min="0"
              {...register(`stock_quantity`, {
                value: getValues("stock_quantity"),
                required: true,
                min: 0,
              })}
            />

            {errors.stock_quantity && (
              <DisplayInputError message={errors.stock_quantity.message} />
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
              {...register(`stock_limit_notification`, {
                value: getValues("stock_limit_notification"),
                required: true,
                min: 0,
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

        {/* Packs */}
        <div className="flex flex-col space-y-2">
          <span className="text-lg ">{t("add_product_pack")}</span>

          <span className="text-sm ">{t("add_product_pack_description")}</span>
        </div>

        {fields.map((pack, index) => (
          <fieldset
            className="border border-solid border-gray-300 p-3"
            key={pack.id}
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
                    id={`packs.${index}.pack`}
                    {...register(`packs.${index}.quantity` as const, {
                      value: getValues(`packs.${index}.quantity`),
                      required: true,
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
                    {t("pack_price")}
                  </label>

                  <input
                    id="price"
                    type="number"
                    placeholder="2.5"
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                    defaultValue={3}
                    required
                    min="0"
                    {...register(`packs.${index}.price` as const, {
                      required: true,
                      min: 0,
                      value: getValues(`packs.${index}.price`),
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

              {/* Pack name  */}
              <div className="flex w-full flex-row items-end space-x-3 space-y-2">
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
                  defaultValue={3}
                  required
                  min="0"
                  {...register(`packs.${index}.name` as const, {
                    required: true,
                    value: getValues(`packs.${index}.name`),
                  })}
                />

                {errors.packs?.[index]?.name && (
                  <DisplayInputError message={"errors.input_required"} />
                )}
              </div>

              {/* File  */}
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
                    preUrl={preUrl}
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
    </section>
  );
}
