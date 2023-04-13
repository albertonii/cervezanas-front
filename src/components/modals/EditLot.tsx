import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Modal } from ".";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../Auth";
import { ProductLot } from "../../lib/types";
import { formatDateDefaultInput } from "../../utils";

type FormValues = {
  created_at: Date;
  lot_id: string;
  lot_number: string;
  lot_name: string;
  product_id: string;
  quantity: number;
  limit_notification: number;
  receipt: string;
  expiration_date: Date;
  manufacture_date: Date;
  packaging: string;
  products: any[];
};

interface Props {
  lots: ProductLot[];
  productLot: ProductLot;
  isEditShowModal: boolean;
  handleSetProductLots: Dispatch<SetStateAction<any>>;
  handleEditShowModal: Dispatch<SetStateAction<any>>;
}

export function EditLot({
  lots,
  productLot,
  isEditShowModal,
  handleSetProductLots,
  handleEditShowModal,
}: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      lot_number: productLot.lot_number,
      lot_name: productLot.lot_name,
      product_id: productLot.product_id,
      quantity: productLot.quantity,
      limit_notification: productLot.limit_notification,
      // receipt: productLot.receipt,
      expiration_date: productLot.expiration_date,
      manufacture_date: productLot.manufacture_date,
      packaging: productLot.packaging,
    },
  });

  const {
    register,
    getValues,
    formState: { errors },
  } = form;

  const handleEditClick = () => {
    const lot_number = getValues("lot_number");
    const lot_name = getValues("lot_name");
    const quantity = getValues("quantity");
    const limit_notification = getValues("limit_notification");
    const receipt = getValues("receipt");
    const expiration_date = getValues("expiration_date");
    const manufacture_date = getValues("manufacture_date");
    const packaging = getValues("packaging");

    const handleLotUpdate = async () => {
      if (productLot) {
        const { data: productLotData, error } = await supabase
          .from("product_lot")
          .update({
            quantity,
            lot_number,
            lot_name,
            limit_notification,
            receipt,
            expiration_date,
            manufacture_date,
            packaging,
            owner_id: user?.id,
          })
          .eq("id", productLot.id);

        if (error) throw error;

        handleEditShowModal(false);

        handleSetProductLots(
          lots.map((lot) => {
            if (lot.id === productLot.id) {
              return {
                ...lot,
                product_id: productLot.id,
                quantity,
                lot_number,
                lot_name,
                limit_notification,
                receipt,
                expiration_date,
                manufacture_date,
                packaging,
                owner_id: user?.id,
              };
            }
            return lot;
          })
        );

        return productLotData;
      } else {
        return null;
      }
    };

    handleLotUpdate();
    handleEditShowModal(false);
  };

  return (
    <form className="w-full">
      <Modal
        showBtn={false}
        isVisible={isEditShowModal}
        title={"config_lot"}
        btnTitle={"edit_lot"}
        description={"modal_product_description"}
        handler={() => {
          handleEditClick();
        }}
        handlerClose={() => handleEditShowModal(false)}
        classIcon={""}
        classContainer={""}
      >
        <div className="relative py-6 flex-auto">
          <div className="w-full flex flex-col ">
            {/* Lot Name Lot Number */}
            <div className="flex w-full flex-row space-x-3 ">
              <div className="w-full space-y ">
                <label htmlFor="lot_name" className="text-sm text-gray-600">
                  {t("lot_name")}
                </label>

                <input
                  id="lot_name"
                  placeholder={t("lot_name")!}
                  type="text"
                  className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  defaultValue={productLot.lot_name}
                  {...register("lot_name", {
                    required: true,
                  })}
                />
                {errors.lot_name?.type === "required" && (
                  <p>{t("errors.input_required")}</p>
                )}
              </div>

              <div className="w-full space-y ">
                <label htmlFor="lot_number" className="text-sm text-gray-600">
                  {t("lot_number")}
                </label>
                <input
                  type="text"
                  id="lot_number"
                  placeholder={t("lot_number")!}
                  className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  defaultValue={productLot.lot_number}
                  {...register("lot_number", {
                    required: true,
                  })}
                />
                {errors.lot_number?.type === "required" && (
                  <p>{t("errors.input_required")}</p>
                )}
              </div>
            </div>
            {/* Quantity & Quantity Notification */}
            <div className="flex w-full flex-row space-x-3 ">
              <div className="w-full space-y ">
                <label htmlFor="quantity" className="text-sm text-gray-600">
                  {t("quantity")}
                </label>
                <input
                  type="number"
                  id="quantity"
                  placeholder={t("quantity")!}
                  className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  defaultValue={productLot.quantity}
                  {...register("quantity", {
                    required: true,
                  })}
                  min="0"
                />
                {errors.quantity?.type === "required" && (
                  <p>{t("errors.input_required")}</p>
                )}
              </div>

              <div className="w-full space-y ">
                <label
                  htmlFor="limit_notification"
                  className="text-sm text-gray-600"
                >
                  {t("limit_notification")}
                </label>
                <input
                  id="limit_notification"
                  placeholder={t("limit_notification")!}
                  type="number"
                  className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  defaultValue={productLot.limit_notification}
                  {...register("limit_notification", {
                    required: true,
                  })}
                  min="0"
                />
                {errors.limit_notification?.type === "required" && (
                  <p>{t("errors.input_required")}</p>
                )}
              </div>
            </div>
            {/* Manufacture Date & Expiration Date */}
            <div className="flex w-full flex-row space-x-3 ">
              <div className="w-full space-y ">
                <label
                  htmlFor="manufacture_date"
                  className="text-sm text-gray-600"
                >
                  {t("manufacture_date")}
                </label>

                <input
                  type="date"
                  id="manufacture_date"
                  placeholder={t("manufacture_date")!}
                  className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  value={formatDateDefaultInput(productLot.manufacture_date)}
                  {...register("manufacture_date", {
                    required: true,
                  })}
                />
                {errors.manufacture_date?.type === "required" && (
                  <p>{t("errors.input_required")}</p>
                )}
              </div>

              <div className="w-full space-y ">
                <label
                  htmlFor="expiration_date"
                  className="text-sm text-gray-600"
                >
                  {t("expiration_date")}
                </label>
                <input
                  id="expiration_date"
                  placeholder={t("expiration_date")!}
                  type="date"
                  className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  value={formatDateDefaultInput(productLot.expiration_date)}
                  {...register("expiration_date", {
                    required: true,
                  })}
                />
                {errors.expiration_date?.type === "required" && (
                  <p>{t("errors.input_required")}</p>
                )}
              </div>
            </div>
            {/* Packaging */}
            <div className="flex w-full flex-row space-x-3 ">
              <div className="w-full space-y ">
                <label htmlFor="packaging" className="text-sm text-gray-600">
                  {t("packaging")}
                </label>

                <textarea
                  id="packaging"
                  placeholder={t("packaging")!}
                  className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  defaultValue={productLot.packaging}
                  {...register("packaging", {
                    required: true,
                  })}
                />
                {errors.packaging?.type === "required" && (
                  <p>{t("errors.input_required")}</p>
                )}
              </div>
            </div>

            {/* Receipt */}
            {/* <div className="flex w-full flex-row space-x-3 ">
              <div className="w-full space-y ">
                <label htmlFor="receipt" className="text-sm text-gray-600">
                  {t("receipt")}
                </label>

                <textarea
                  id="receipt"
                  placeholder={t("receipt")!}
                  className="relative block w-full min-h-20 max-h-48 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  defaultValue={productLot.receipt}
                  {...register("receipt", {
                    required: true,
                  })}
                />
                {errors.receipt?.type === "required" && (
                  <p>{t("errors.input_required")}</p>
                )}
              </div>
            </div> */}

            {/* Separator  */}
            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-full h-[0.15rem] my-8 bg-beer-foam border-0 rounded dark:bg-gray-700" />
            </div>

            {/* Display lot attached to product  */}
            <div className="flex w-full flex-row space-x-3 ">
              <div className="w-full space-y ">
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
