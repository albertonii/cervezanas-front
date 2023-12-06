"use client";

import useFetchProductsByOwner from "../../../../hooks/useFetchProductsByOwner";
import React, { useEffect, useState } from "react";
import { z, ZodType } from "zod";
import { useTranslations } from "next-intl";
import { useAuth } from "../../Auth/useAuth";
import { ModalWithForm } from "./ModalWithForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "react-query";
import { format_options } from "../../../../lib/beerEnum";
import { SubmitHandler, useForm } from "react-hook-form";
import { DisplayInputError } from "../common/DisplayInputError";
import { SearchCheckboxList } from "../common/SearchCheckboxList";

type ModalAddLotFormData = {
  quantity: number;
  lot_name: string;
  lot_number: string;
  product_id: string;
  limit_notification: number;
  recipe: string;
  expiration_date: Date;
  manufacture_date: Date;
  packaging: string;
};

const schema: ZodType<ModalAddLotFormData> = z.object({
  lot_number: z.string().min(1, { message: "errors.input_required" }),
  lot_name: z.string().nonempty({ message: "errors.input_required" }),
  quantity: z.number().positive({ message: "errors.input_required" }),
  limit_notification: z.number().positive({ message: "errors.input_required" }),
  recipe: z.string().nonempty({ message: "errors.input_required" }),
  expiration_date: z.date(),
  manufacture_date: z.date(),
  packaging: z.string().nonempty({ message: "errors.input_required" }),
  product_id: z.string().nonempty({ message: "errors.input_required" }),
});

type ValidationSchema = z.infer<typeof schema>;

export function AddLot() {
  const t = useTranslations();
  const { user, supabase } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);

  const { data: products } = useFetchProductsByOwner(user?.id);

  const form = useForm<ModalAddLotFormData>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      lot_number: "",
      lot_name: "",
      product_id: "",
      quantity: 100,
      limit_notification: 10,
      recipe: "",
      expiration_date: new Date(),
      manufacture_date: new Date(),
      packaging: t(format_options[0].label) ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const queryClient = useQueryClient();

  const handleInsertLot = async (form: ValidationSchema) => {
    const {
      quantity,
      lot_number,
      lot_name,
      limit_notification,
      recipe,
      expiration_date,
      manufacture_date,
      packaging,
      product_id,
    } = form;

    const expirationDateToString = expiration_date?.toISOString();
    const manufactureDateToString = manufacture_date?.toISOString();

    const userId = user?.id;
    console.log(quantity);
    const { error } = await supabase.from("product_lots").insert({
      quantity,
      lot_number,
      lot_name,
      limit_notification,
      recipe,
      packaging,
      product_id,
      owner_id: userId,
      expiration_date: expirationDateToString,
      manufacture_date: manufactureDateToString,
    });

    if (error) throw error;
  };

  const insertProductLotMutation = useMutation({
    mutationKey: ["insertProductLot"],
    mutationFn: handleInsertLot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productLotList"] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (
    formValues: ModalAddLotFormData
  ) => {
    console.log("dentro");
    try {
      insertProductLotMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
    setShowModal(false);
    reset();
  };

  return (
    <ModalWithForm
      showBtn={true}
      showModal={showModal}
      setShowModal={setShowModal}
      title={"config_lot"}
      btnTitle={"add_lot"}
      description={"modal_product_description"}
      handler={handleSubmit(onSubmit)}
      classIcon={""}
      classContainer={""}
      form={form}
    >
      <form>
        <section className="relative flex w-full flex-auto flex-col  py-6">
          {/* Lot Name Lot Number */}
          <div className="flex w-full flex-row space-x-3 ">
            <div className="space-y w-full ">
              <label htmlFor="lot_name" className="text-sm text-gray-600">
                {t("lot_name")}
              </label>

              <input
                id="lot_name"
                placeholder={t("lot_name") ?? "Lot name"}
                type="text"
                className="min-h-20 relative block max-h-56 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register("lot_name", {
                  required: true,
                })}
              />
              {errors.lot_name && (
                <DisplayInputError message={errors.lot_name.message} />
              )}
            </div>

            <div className="space-y w-full ">
              <label htmlFor="lot_number" className="text-sm text-gray-600">
                {t("lot_number")}
              </label>

              <input
                type="text"
                id="lot_number"
                placeholder={t("lot_number") ?? "Lot number"}
                className="min-h-20 relative block max-h-56 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register("lot_number", {
                  required: true,
                })}
              />

              {errors.lot_number && (
                <DisplayInputError message={errors.lot_number.message} />
              )}
            </div>
          </div>

          {/* Quantity & Quantity Notification */}
          <div className="flex w-full flex-row space-x-3 ">
            <div className="space-y w-full ">
              <label htmlFor="quantity" className="text-sm text-gray-600">
                {t("quantity")}
              </label>

              <input
                type="number"
                id="quantity"
                placeholder={t("quantity") ?? "Quantity"}
                className="min-h-20 relative block max-h-56 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register("quantity", {
                  valueAsNumber: true,
                })}
                min="0"
              />

              {errors.quantity && (
                <DisplayInputError message={errors.quantity.message} />
              )}
            </div>

            <div className="space-y w-full ">
              <label
                htmlFor="limit_notification"
                className="text-sm text-gray-600"
              >
                {t("limit_notification")}
              </label>

              <input
                id="limit_notification"
                placeholder={t("limit_notification") ?? "Limit notification"}
                type="number"
                className="min-h-20 relative block max-h-56 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register("limit_notification", {
                  valueAsNumber: true,
                })}
                min="0"
              />

              {errors.limit_notification && (
                <DisplayInputError
                  message={errors.limit_notification.message}
                />
              )}
            </div>
          </div>

          {/* Manufacture Date & Expiration Date */}
          <div className="flex w-full flex-row space-x-3 ">
            <div className="space-y w-full ">
              <label
                htmlFor="manufacture_date"
                className="text-sm text-gray-600"
              >
                {t("manufacture_date")}
              </label>
              <input
                type="date"
                id="manufacture_date"
                placeholder={t("manufacture_date") ?? "Manufacture date"}
                className="min-h-20 relative block max-h-56 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register("manufacture_date", {
                  valueAsDate: true,
                })}
              />
              {errors.manufacture_date && (
                <DisplayInputError message={errors.manufacture_date.message} />
              )}
            </div>

            <div className="space-y w-full ">
              <label
                htmlFor="expiration_date"
                className="text-sm text-gray-600"
              >
                {t("expiration_date")}
              </label>

              <input
                id="expiration_date"
                placeholder={t("expiration_date") ?? "Expiration date"}
                type="date"
                className="min-h-20 relative block max-h-56 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register("expiration_date", {
                  valueAsDate: true,
                })}
              />
              {errors.expiration_date && (
                <DisplayInputError message={errors.expiration_date.message} />
              )}
            </div>
          </div>

          {/* Packaging & Receipt */}
          <div className="flex w-full flex-row space-x-3 ">
            <div className="space-y w-full ">
              <label htmlFor="packaging" className="text-sm text-gray-600">
                {t("packaging")}
              </label>

              <select
                {...register(`packaging`, { required: true })}
                value={format_options[0].label}
                className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {format_options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>

              {errors.packaging && (
                <DisplayInputError message={errors.packaging.message} />
              )}
            </div>
          </div>

          <div className="flex w-full flex-row space-x-3 ">
            <div className="space-y w-full ">
              <label htmlFor="recipe" className="text-sm text-gray-600">
                {t("beer_recipe")}
              </label>

              <textarea
                id="beer_recipe"
                placeholder={t("beer_recipe") ?? "Beer recipe"}
                className="min-h-20 relative block max-h-48 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register("recipe", {
                  required: true,
                })}
              />
              {errors.recipe && (
                <DisplayInputError message={errors.recipe.message} />
              )}
            </div>
          </div>

          <SearchCheckboxList list={products ?? []} form={form} />
        </section>
      </form>
    </ModalWithForm>
  );
}
