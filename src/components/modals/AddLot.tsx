import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Modal } from ".";
import useFetchProducts from "../../hooks/useFetchProducts";
import { supabase } from "../../utils/supabaseClient";
import { SearchCheckboxList } from "../common";

type FormValues = {
  lot_number: string;
  lot_quantity: number;
  products: any[];
};

export function AddLot() {
  const { t } = useTranslation();

  const { data: productsLot, isSuccess } = useFetchProducts();

  const form = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      lot_number: "",
      lot_quantity: 0,
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
    const { lot_number, lot_quantity, products } = formValues;

    const handleLotInsert = () => {
      products.map(async (product: { value: any }) => {
        if (product.value != false) {
          const product_id = product.value;
          const { error } = await supabase.from("product_lot").insert({
            product_id: product_id,
            num_lot_id: lot_number,
            created_at: new Date(),
            quantity: lot_quantity,
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
        btnTitle={"config_lot"}
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
                <label htmlFor="lot_quantity" className="text-sm text-gray-600">
                  {t("lot_quantity")}
                </label>
                <input
                  id="lot_quantity"
                  placeholder={t("lot_quantity")!}
                  type="number"
                  className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                  {...register("lot_quantity", {
                    required: true,
                  })}
                />
                {errors.lot_quantity?.type === "required" && (
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
