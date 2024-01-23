"use client";

import React, { ComponentProps, useMemo, useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { IconButton } from "../common/IconButton";
import { IProduct } from "../../../../lib/types";
import { category_options } from "../../../../lib/productEnum";
import { DisplayInputError } from "../common/DisplayInputError";
import { faHandPointer } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../Auth/useAuth";
import InputSearch from "../common/InputSearch";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import ModalWithForm from "./ModalWithForm";

enum SortBy {
  NONE = "none",
  USERNAME = "username",
  CREATED_DATE = "created_date",
  MONTH = "month",
  NAME = "name",
}

type FormData = {
  id: string;
  category: string;
  month: number;
  year: number;
};

const mProductsSchema: ZodType<FormData> = z.object({
  id: z.string().uuid().nonempty("Please select a product"),
  category: z
    .string()
    .nonempty("Please select a category for this monthly product"),
  month: z.number().min(1, "Please select a month for this product"),
  year: z.number().min(1, "Please select a year for this product"),
});

type ValidationSchema = z.infer<typeof mProductsSchema>;

interface Props {
  products: IProduct[];
  handleAddProduct: ComponentProps<any>;
}

export default function AddMonthlyProduct({
  handleAddProduct,
  products,
}: Props) {
  const t = useTranslations();
  const { supabase } = useAuth();

  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [selectedProduct, setSelectedCP] = useState<IProduct>();

  const [query, setQuery] = useState("");

  const [showModal, setShowModal] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(mProductsSchema),
    defaultValues: {
      id: "",
      category: "community",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = form;

  const filteredItems = useMemo<IProduct[]>(() => {
    if (!products) return [];
    return products.filter((product) => {
      return product.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [products, query]);

  const sortedItems = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredItems;

    const compareProperties: Record<string, (product: IProduct) => any> = {
      [SortBy.NAME]: (product) => product.name,
      [SortBy.CREATED_DATE]: (product) => product.created_at,
    };

    return filteredItems.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting];
      return extractProperty(a).localeCompare(extractProperty(b));
    });
  }, [filteredItems, sorting]);

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  const handleProductClicked = (product: IProduct) => {
    setValue("id", product.id);
    setSelectedCP(product);
  };

  const handleMonthClicked = (e: React.ChangeEvent<any>) => {
    const month = parseInt(e.target.value);

    setValue("month", month);
  };

  const handleYearClicked = (e: React.ChangeEvent<any>) => {
    const year = parseInt(e.target.value);
    setValue("year", year);
  };

  const handleInsertMonthlyProduct = async (form: ValidationSchema) => {
    const { category, month, year } = form;

    if (!selectedProduct) return console.info("No product selected");

    const { data, error } = await supabase
      .from("monthly_products")
      .insert({
        id: selectedProduct.id,
        category,
        month,
        year,
      })
      .select("id, category, month, year");

    if (error) {
      throw error;
    }

    setShowModal(false);
    handleAddProduct(data[0]);

    reset();
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const handleInsertMProductMutation = useMutation({
    mutationKey: "monthly_products",
    mutationFn: handleInsertMonthlyProduct,
    onSuccess: () => {
      console.info("Monthly product inserted");
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (
    formValues: FormData
  ) => {
    try {
      handleInsertMProductMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ModalWithForm
      showBtn={true}
      showModal={showModal}
      setShowModal={setShowModal}
      title={t("add_monthly_product")}
      btnTitle={t("new_monthly_product")}
      description={""}
      handler={handleSubmit(onSubmit)}
      classIcon={"w-6 h-6"}
      classContainer={""}
      form={form}
    >
      <form>
        <fieldset className="space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
          <legend className="m-2 text-2xl">{t("cp_fixed_info")}</legend>

          {/* Category  */}
          <div className="flex flex-col space-y-2">
            <select
              id="category"
              {...register("category", { required: true })}
              defaultValue={category_options[0].label}
              className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            >
              {category_options.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>
            {errors.category && (
              <DisplayInputError message={errors.category.message} />
            )}
          </div>

          {/* Month and Year */}
          <div className="flex flex-row space-x-4">
            <div className="flex w-full flex-row items-center">
              <label htmlFor="month" className="mr-2">
                {t("month")}
              </label>

              <select
                id="month"
                name="month"
                className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-8 text-sm text-gray-900 focus:border-beer-blonde focus:ring-beer-blonde  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                onClick={(e) => handleMonthClicked(e)}
                value={new Date().getMonth() + 1}
              >
                <option value="0">{t("select_month")}</option>
                <option value="1">{t("january")}</option>
                <option value="2">{t("february")}</option>
                <option value="3">{t("march")}</option>
                <option value="4">{t("april")}</option>
                <option value="5">{t("may")}</option>
                <option value="6">{t("june")}</option>
                <option value="7">{t("july")}</option>
                <option value="8">{t("august")}</option>
                <option value="9">{t("september")}</option>
                <option value="10">{t("october")}</option>
                <option value="11">{t("november")}</option>
                <option value="12">{t("december")}</option>
              </select>
            </div>

            {/* Year */}
            <div className="flex w-full flex-row items-center">
              <label htmlFor="year" className="mr-2">
                {t("year")}
              </label>

              <select
                id="year"
                name="year"
                className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-8 text-sm text-gray-900 focus:border-beer-blonde focus:ring-beer-blonde  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                onClick={(e) => handleYearClicked(e)}
                value={new Date().getFullYear()}
              >
                <option value="0">{t("select_year")}</option>
                <option value="2023">{t("2023")}</option>
                <option value="2024">{t("2024")}</option>
                <option value="2025">{t("2025")}</option>
              </select>
            </div>
          </div>

          {/* List of products */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="product" className="mr-2">
              {t("product")}
            </label>

            <InputSearch
              query={query}
              setQuery={setQuery}
              searchPlaceholder={"search_products"}
            />

            <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3"></th>

                  <th
                    scope="col"
                    className="px-6 py-3 hover:cursor-pointer"
                    onClick={() => {
                      handleChangeSort(SortBy.NAME);
                    }}
                  >
                    {t("name_header")}
                  </th>

                  <th scope="col" className="px-6 py-3 ">
                    {t("action_header")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedItems.map((product) => {
                  return (
                    <tr
                      key={product.id}
                      className={` border-b dark:border-gray-700 dark:bg-gray-800 
                      ${
                        product.id === selectedProduct?.id && `bg-beer-draft`
                      } `}
                    >
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      ></th>

                      <td className="px-6 py-4 font-semibold text-beer-blonde ">
                        {product.name}
                      </td>

                      <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                        <IconButton
                          onClick={() => handleProductClicked(product)}
                          icon={faHandPointer}
                          title={t("select_product")}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </fieldset>
      </form>
    </ModalWithForm>
  );
}
