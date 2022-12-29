import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useFetchProducts from "../../../hooks/useFetchProducts";
import { supabase } from "../../../utils/supabaseClient";

type FormValues = {
  lot_number: string;
  lot_quantity: number;
  products: any;
};

export default function LotForm() {
  const { t } = useTranslation();

  const { data, isSuccess } = useFetchProducts();

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

    const handleLotInsert = async () => {
      const { data, error } = await supabase
        .from("lots")
        .insert({ num_lot: lot_number, quantity: lot_quantity })
        .select();

      if (error) throw error;
      return data;
    };

    // handleLotInsert();
    reset();
  };

  if (!isSuccess) return <></>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
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
                className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                {...register("lot_number", {
                  required: true,
                })}
              />
              {errors.lot_number?.type === "required" && (
                <p>Campo lote es requerido</p>
              )}
            </div>

            <div className="w-full space-y ">
              <label htmlFor="lot_quantity" className="text-sm text-gray-600">
                {t("lot_quantity")}
              </label>
              <input
                id="lot_quantity"
                placeholder={t("lot_quantity")!}
                className="relative block w-full min-h-20 max-h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                {...register("lot_quantity", {
                  required: true,
                })}
              />
              {errors.lot_quantity?.type === "required" && (
                <p>Campo cantidad de lote es requerido</p>
              )}
            </div>
          </div>

          <div className="w-full space-y my-6">
            <div>
              <div className=" z-10 w-full bg-white rounded shadow dark:bg-gray-700">
                <div className="p-3">
                  <label className="sr-only">Search</label>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search user"
                    />
                  </div>
                </div>

                <ul
                  className="overflow-y-auto px-3 pb-3 h-48 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownSearchButton"
                >
                  {data.map((product) => {
                    return (
                      <li key={product.id}>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            id="checkbox-item-11"
                            type="checkbox"
                            {...register("products")}
                            value={product.id}
                            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label className="ml-2 w-full text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                            {product.name}
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
        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
          <button
            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="submit"
          >
            {t("save")}
          </button>

          <button
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            // onClick={() => setShowModal(false)}
          >
            {t("close")}
          </button>
        </div>
      </div>
    </form>
  );
}
