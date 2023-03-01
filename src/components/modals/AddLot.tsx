import React from "react";
import useFetchProducts from "../../hooks/useFetchProducts";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Modal } from ".";
import { supabase } from "../../utils/supabaseClient";
import { SearchCheckboxList } from "../common";
import { BeerEnum } from "../../lib/beerEnum";

type FormValues = {
  created_at: Date;
  lot_id: string;
  lot_number: string;
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
      quantity: 0,
      product_id: "",
      limit_notification: 0,
      receipt: "",
      expiration_date: new Date(),
      manufacture_date: new Date(),
      packaging: BeerEnum.Format.can.toString(),
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
    const { lot_number, quantity, products } = formValues;

    const handleLotInsert = () => {
      products.map(async (product: { value: any }) => {
        if (product.value != false) {
          const product_id = product.value;
          const { error } = await supabase.from("product_lot").insert({
            product_id: product_id,
            num_lot_id: lot_number,
            created_at: new Date(),
            quantity: quantity,
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
        description={""}
        handler={handleSubmit(onSubmit)}
        classIcon={""}
        classContainer={""}
      >
        <div className="relative p-6 flex-auto">
          <p className="my-4 text-slate-500 text-lg leading-relaxed">
            {t("modal_product_description")}
          </p>

          <div className="flex w-full flex-col ">
            {/* Lot Number & Quantity */}
            <div className="flex w-full flex-row space-x-3 ">
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

              <div className="w-full space-y ">
                <label htmlFor="quantity" className="text-sm text-gray-600">
                  {t("quantity")}
                </label>
                <input
                  id="quantity"
                  placeholder={t("lot_quantity")!}
                  type="number"
                  className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  {...register("quantity", {
                    required: true,
                  })}
                />
                {errors.quantity?.type === "required" && (
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
                <input
                  type="text"
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
                  className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
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
