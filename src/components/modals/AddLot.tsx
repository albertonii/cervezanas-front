import React from "react";
import useFetchProducts from "../../hooks/useFetchProducts";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Modal } from ".";
import { supabase } from "../../utils/supabaseClient";
import { SearchCheckboxList } from "../common";
import { format_options } from "../../lib/beerEnum";

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

export function AddLot() {
  const { t } = useTranslation();

  const { data: productsLot, isSuccess } = useFetchProducts();

  const form = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      lot_number: "",
      lot_name: "",
      product_id: "",
      quantity: 0,
      limit_notification: 0,
      receipt: "",
      expiration_date: new Date(),
      manufacture_date: new Date(),
      packaging: format_options[0].value.toString(),
      products: [],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = (formValues: FormValues) => {
    const {
      lot_number,
      lot_name,
      quantity,
      products,
      limit_notification,
      receipt,
      expiration_date,
      manufacture_date,
      packaging,
    } = formValues;

    const handleLotInsert = () => {
      console.log(products);
      products.map(async (product: { value: any }) => {
        if (product.value != false) {
          const product_id = product.value;
          const { error } = await supabase.from("product_lot").insert({
            product_id: product_id,
            created_at: new Date(),
            quantity,
            lot_number,
            lot_name,
            limit_notification,
            receipt,
            expiration_date,
            manufacture_date,
            packaging,
          });

          if (error) throw error;
        }
      });

      reset();
    };

    handleLotInsert();
  };

  if (!isSuccess) return <></>;

  return (
    <form className="w-full">
      <Modal
        showBtn={true}
        isVisible={false}
        title={"config_lot"}
        btnTitle={"add_lot"}
        description={"modal_product_description"}
        handler={handleSubmit(onSubmit)}
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
                  {...register("lot_name", {
                    required: true,
                  })}
                />
                {errors.lot_name?.type === "required" && (
                  <p>{t("product_modal_required")}</p>
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
                  {...register("lot_number", {
                    required: true,
                  })}
                />
                {errors.lot_number?.type === "required" && (
                  <p>{t("product_modal_required")}</p>
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
                  {...register("quantity", {
                    required: true,
                  })}
                  min="0"
                />
                {errors.quantity?.type === "required" && (
                  <p>{t("product_modal_required")}</p>
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
                  {...register("limit_notification", {
                    required: true,
                  })}
                  min="0"
                />
                {errors.limit_notification?.type === "required" && (
                  <p>{t("product_modal_required")}</p>
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
                  {...register("manufacture_date", {
                    required: true,
                  })}
                />
                {errors.manufacture_date?.type === "required" && (
                  <p>{t("product_modal_required")}</p>
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
                  {...register("expiration_date", {
                    required: true,
                  })}
                />
                {errors.expiration_date?.type === "required" && (
                  <p>{t("product_modal_required")}</p>
                )}
              </div>
            </div>

            {/* Packaging & Receipt */}
            <div className="flex w-full flex-row space-x-3 ">
              <div className="w-full space-y ">
                <label htmlFor="packaging" className="text-sm text-gray-600">
                  {t("packaging")}
                </label>

                <textarea
                  id="packaging"
                  placeholder={t("packaging")!}
                  className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  {...register("packaging", {
                    required: true,
                  })}
                />
                {errors.packaging?.type === "required" && (
                  <p>{t("product_modal_required")}</p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-row space-x-3 ">
              <div className="w-full space-y ">
                <label htmlFor="receipt" className="text-sm text-gray-600">
                  {t("receipt")}
                </label>

                <textarea
                  id="receipt"
                  placeholder={t("receipt")!}
                  className="relative block w-full min-h-20 max-h-48 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  {...register("receipt", {
                    required: true,
                  })}
                />
                {errors.receipt?.type === "required" && (
                  <p>{t("product_modal_required")}</p>
                )}
              </div>
            </div>

            <SearchCheckboxList list={productsLot} form={form} />
          </div>
        </div>
      </Modal>
    </form>
  );
}
