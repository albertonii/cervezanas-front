"use client";

import useFetchProductsByOwner from "../../../../hooks/useFetchProductsByOwner";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Modal } from "./Modal";
import { DisplayInputError } from "../common/DisplayInputError";
import { SearchCheckboxList } from "../common/SearchCheckboxList";
import { useAuth } from "../../Auth/useAuth";
import { format_options } from "../../../../lib/beerEnum";
import { useSupabase } from "../../../../context/SupabaseProvider";
import { useMutation, useQueryClient } from "react-query";

type FormData = {
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

export function AddLot() {
  const t = useTranslations();
  const { supabase } = useSupabase();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);

  const { data: products } = useFetchProductsByOwner(user?.id);

  const form = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: {
      lot_number: "",
      lot_name: "",
      product_id: "",
      quantity: 0,
      limit_notification: 0,
      recipe: "",
      expiration_date: new Date(),
      manufacture_date: new Date(),
      packaging: t(format_options[0].label) ?? "",
      products: [],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const queryClient = useQueryClient();

  const handleInsertLot = async (formValues: any) => {
    const {
      lot_number,
      lot_name,
      quantity,
      products,
      limit_notification,
      recipe,
      expiration_date,
      manufacture_date,
      packaging,
    } = formValues;

    const userId = user?.id;

    products.map(async (product: { value: any }) => {
      if (product.value != false) {
        const product_id = product.value;
        const { error } = await supabase.from("product_lots").insert({
          product_id,
          quantity,
          lot_number,
          lot_name,
          limit_notification,
          recipe,
          expiration_date,
          manufacture_date,
          packaging,
          owner_id: userId,
        });

        if (error) throw error;
      }
    });
  };

  const insertProductLotMutation = useMutation({
    mutationKey: ["insertProductLot"],
    mutationFn: handleInsertLot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productLotList"] });
    },
  });

  const onSubmit = (formValues: FormData) => {
    try {
      insertProductLotMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
    setShowModal(false);
    reset();
  };

  return (
    <form className="w-full">
      <Modal
        showBtn={true}
        showModal={showModal}
        setShowModal={setShowModal}
        title={"config_lot"}
        btnTitle={"add_lot"}
        description={"modal_product_description"}
        handler={handleSubmit(onSubmit)}
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
                  {...register("expiration_date", {
                    required: true,
                  })}
                />
                {errors.expiration_date?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
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

                {errors.packaging?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
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
                {errors.recipe?.type === "required" && (
                  <DisplayInputError message="errors.input_required" />
                )}
              </div>
            </div>

            <SearchCheckboxList list={products ?? []} form={form} />
          </div>
        </div>
      </Modal>
    </form>
  );
}