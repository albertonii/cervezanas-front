"use client";

import React, { ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Modal } from ".";
import { useAuth } from "../Auth";
import { formatDateDefaultInput } from "../../utils";
import { DisplayInputError } from "../common";
import { useSupabase } from "../Context/SupabaseProvider";
import { useMutation, useQueryClient } from "react-query";
import { IRefProductLot } from "../../lib/types";

type FormValues = {
  created_at: string;
  lot_id: string;
  lot_number: string;
  lot_name: string;
  product_id: string;
  quantity: number;
  limit_notification: number;
  recipe: string;
  expiration_date: Date;
  manufacture_date: Date;
  packaging: string;
  products: any[];
};

interface Props {
  productLot: IRefProductLot;
  showModal: boolean;
  handleEditShowModal: ComponentProps<any>;
}

export function UpdateLot({
  productLot,
  showModal,
  handleEditShowModal,
}: Props) {
  const t = useTranslations();
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      lot_number: productLot.lot_number,
      lot_name: productLot.lot_name,
      product_id: productLot.product_id,
      quantity: productLot.quantity,
      limit_notification: productLot.limit_notification,
      // recipe: productLot.recipe,
      expiration_date: productLot.expiration_date,
      manufacture_date: productLot.manufacture_date,
      packaging: productLot.packaging,
    },
  });

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleLotUpdate = async () => {
    const lot_number = getValues("lot_number");
    const lot_name = getValues("lot_name");
    const quantity = getValues("quantity");
    const limit_notification = getValues("limit_notification");
    const recipe = getValues("recipe");
    const expiration_date = getValues("expiration_date");
    const manufacture_date = getValues("manufacture_date");
    const packaging = getValues("packaging");

    if (productLot) {
      const { error } = await supabase
        .from("product_lots")
        .update({
          quantity,
          lot_number,
          lot_name,
          limit_notification,
          recipe,
          expiration_date,
          manufacture_date,
          packaging,
          owner_id: user?.id,
        })
        .eq("id", productLot.id);

      if (error) throw error;
    }

    handleEditShowModal(false);
  };

  const updateLotMutation = useMutation({
    mutationKey: ["updateLot"],
    mutationFn: handleLotUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries("productLotList");
    },
  });

  const onSubmit = () => {
    try {
      updateLotMutation.mutate();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form className="w-full">
      <Modal
        showBtn={false}
        showModal={showModal}
        setShowModal={handleEditShowModal}
        title={"config_lot"}
        btnTitle={"edit_lot"}
        description={"modal_product_description"}
        handler={handleSubmit(onSubmit)}
        handlerClose={() => handleEditShowModal(false)}
        classIcon={""}
        classContainer={""}
      >
        <div className="relative flex-auto py-6">
          <div className="flex w-full flex-col ">
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
                  defaultValue={productLot.lot_name}
                  {...register("lot_name", {
                    required: true,
                  })}
                />
                {errors.lot_name?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
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
                  defaultValue={productLot.lot_number}
                  {...register("lot_number", {
                    required: true,
                  })}
                />
                {errors.lot_number?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
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
                  defaultValue={productLot.quantity}
                  {...register("quantity", {
                    required: true,
                  })}
                  min="0"
                />
                {errors.quantity?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
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
                  defaultValue={productLot.limit_notification}
                  {...register("limit_notification", {
                    required: true,
                  })}
                  min="0"
                />
                {errors.limit_notification?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
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
                  value={formatDateDefaultInput(productLot.manufacture_date)}
                  {...register("manufacture_date", {
                    required: true,
                  })}
                />
                {errors.manufacture_date?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
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
                  value={formatDateDefaultInput(productLot.expiration_date)}
                  {...register("expiration_date", {
                    required: true,
                  })}
                />
                {errors.expiration_date?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </div>
            </div>
            {/* Packaging */}
            <div className="flex w-full flex-row space-x-3 ">
              <div className="space-y w-full ">
                <label htmlFor="packaging" className="text-sm text-gray-600">
                  {t("packaging")}
                </label>

                <textarea
                  id="packaging"
                  placeholder={t("packaging") ?? "Packaging"}
                  className="min-h-20 relative block max-h-56 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  defaultValue={productLot.packaging}
                  {...register("packaging", {
                    required: true,
                  })}
                />
                {errors.packaging?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </div>
            </div>

            {/* Separator  */}
            <div className="inline-flex w-full items-center justify-center">
              <hr className="my-8 h-[0.15rem] w-full rounded border-0 bg-beer-foam dark:bg-gray-700" />
            </div>

            {/* Display lot attached to product  */}
            <div className="flex w-full flex-row space-x-3 ">
              <div className="space-y w-full ">
                <label htmlFor="lot" className="text-sm text-gray-600">
                  {t("lot_attached_to_product")}
                </label>

                <p> {productLot.products.name} </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </form>
  );
}
