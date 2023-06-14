import React from "react";
import useFetchProducts from "../../../hooks/useFetchBeers";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useSupabase } from "../../Context/SupabaseProvider";

type FormValues = {
  lot_number: string;
  lot_quantity: number;
  products: any[];
};

interface Props {
  handleShowModal: React.Dispatch<React.SetStateAction<any>>;
}

export default function LotForm({ handleShowModal }: Props) {
  const t = useTranslations();

  const { supabase } = useSupabase();

  const { data: productsLot, isSuccess } = useFetchProducts();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      lot_number: "",
      lot_quantity: 0,
      products: [],
    },
  });

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

      handleShowModal(false);
      reset();
    };

    handleLotInsert();
  };

  if (!isSuccess) return <></>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="relative flex-auto p-6">
        <p className="text-slate-500 my-4 text-lg leading-relaxed">
          {t("modal_product_description")}
        </p>

        <div className="flex w-full flex-col ">
          <div className="flex w-full flex-row space-x-3 ">
            <div className="space-y w-full ">
              <label htmlFor="lot_number" className="text-sm text-gray-600">
                {t("lot_number")}
              </label>
              <input
                type="text"
                id="lot_number"
                placeholder={t("lot_number") ?? "lot_number"}
                className="min-h-20 relative block max-h-56 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                {...register("lot_number", {
                  required: true,
                })}
              />
              {errors.lot_number?.type === "required" && (
                <p>{t("product_modal_required")}</p>
              )}
            </div>

            <div className="space-y w-full ">
              <label htmlFor="lot_quantity" className="text-sm text-gray-600">
                {t("lot_quantity")}
              </label>
              <input
                id="lot_quantity"
                placeholder={t("lot_quantity") ?? "lot_quantity"}
                type="number"
                className="min-h-20 relative block max-h-56 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                {...register("lot_quantity", {
                  required: true,
                })}
              />
              {errors.lot_quantity?.type === "required" && (
                <p>{t("product_modal_required")}</p>
              )}
            </div>
          </div>

          <div className="space-y my-6 w-full">
            <div>
              <div className=" z-10 w-full rounded bg-white shadow dark:bg-gray-700">
                <div className="p-3">
                  <label className="sr-only">Search</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>

                    <input
                      type="text"
                      id="input-group-search"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder={t("search_lots")}
                    />
                  </div>
                </div>

                <ul
                  className="h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownSearchButton"
                >
                  {productsLot.map((product, index: number) => {
                    return (
                      <li key={product.id}>
                        <div className="flex items-center rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            id="checkbox-item-11"
                            type="checkbox"
                            {...register(`products.${index}.value`)}
                            value={productsLot[index].id}
                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
                          />
                          <label
                            htmlFor={`products.${index}.value`}
                            className="ml-2 w-full rounded text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            {product.lot_name}
                          </label>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/*footer*/}
        <div className="border-slate-200 flex items-center justify-end rounded-b border-t border-solid p-6">
          <button
            className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
            type="submit"
          >
            {t("save")}
          </button>

          <button
            className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
            type="button"
            onClick={() => handleShowModal(false)}
          >
            {t("close")}
          </button>
        </div>
      </div>
    </form>
  );
}
