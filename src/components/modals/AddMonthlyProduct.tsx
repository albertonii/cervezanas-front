import React, { ComponentProps, useEffect, useMemo, useState } from "react";
import { faAdd, faHandPointer } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { category_options } from "../../lib/productEnum";
import { IProduct, SortBy } from "../../lib/types.d";
import { supabase } from "../../utils/supabaseClient";
import { IconButton } from "../common";
import { Modal } from "./Modal";

interface FormData {
  category: string;
  month: number;
  year: number;
  product_id: IProduct;
}

interface Props {
  handleAddProduct: ComponentProps<any>;
}

export default function AddMonthlyProduct({ handleAddProduct }: Props) {
  const { t } = useTranslation();

  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [selectedProduct, setSelectedCP] = useState<IProduct>();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [query, setQuery] = useState("");

  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    if (showModal) {
      const getProducts = async () => {
        const { data, error } = await supabase
          .from("products")
          .select("id, name");
        if (error) {
          throw error;
        }
        setProducts(data);
      };

      getProducts();
    }
  }, [showModal]);

  const filteredItems = useMemo<IProduct[]>(() => {
    if (!products) return [];
    console.log(query.toLowerCase());
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

  const handleClick = (product: IProduct) => {
    setSelectedCP(product);
  };

  const onSubmit = async (formValues: FormData) => {
    if (!selectedProduct) return console.log("No product selected");

    const { category, month, year } = formValues;

    const { data, error } = await supabase
      .from("monthly_products")
      .insert({
        category,
        month,
        year,
        product_id: selectedProduct.id,
      })
      .select("id, category, month, year, product_id (id, name)");

    if (error) {
      throw error;
    }

    handleAddProduct(data[0]);

    setShowModal(false);

    reset();
  };

  return (
    <Modal
      showBtn={true}
      showModal={showModal}
      setShowModal={setShowModal}
      title={t("add_monthly_product")}
      btnTitle={t("new_monthly_product")}
      description={""}
      icon={faAdd}
      handler={handleSubmit(onSubmit)}
      btnSize={"large"}
      classIcon={"w-6 h-6"}
      classContainer={""}
    >
      <form>
        <fieldset className="space-y-4 p-4 border-2 rounded-md border-beer-softBlondeBubble">
          <legend className="text-2xl m-2">{t("cp_fixed_info")}</legend>

          {/* Category  */}
          <div className="flex flex-col space-y-2">
            <select
              id="category"
              {...register("category", { required: true })}
              defaultValue={category_options[0].label}
              className="text-sm  relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
            >
              {category_options.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>
            {errors.category?.type === "required" && (
              <p>{t("errors.input_required")}</p>
            )}
          </div>

          {/* Month and Year */}
          <div className="flex flex-row space-x-4">
            <div className="flex flex-row items-center w-full">
              <label htmlFor="month" className="mr-2">
                {t("month")}
              </label>

              <select
                id="month"
                name="month"
                className="pr-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-beer-blonde focus:border-beer-blonde block p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...(register("month"), { required: true })}
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
            <div className="flex flex-row items-center w-full">
              <label htmlFor="year" className="mr-2">
                {t("year")}
              </label>
              <select
                id="year"
                name="year"
                {...(register("year"), { required: true })}
                className="pr-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-beer-blonde focus:border-beer-blonde block p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-beer-blonde focus:border-beer-blonde block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search by name..."
              />
            </div>

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-3 px-6"></th>

                  <th
                    scope="col"
                    className="py-3 px-6 hover:cursor-pointer"
                    onClick={() => {
                      handleChangeSort(SortBy.NAME);
                    }}
                  >
                    {t("name_header")}
                  </th>

                  <th scope="col" className="py-3 px-6 ">
                    {t("action_header")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedItems.map((product) => {
                  return (
                    <tr
                      key={product.id}
                      className={` border-b dark:bg-gray-800 dark:border-gray-700 
                      ${
                        product.id === selectedProduct?.id && `bg-beer-draft`
                      } `}
                    >
                      <th
                        scope="row"
                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      ></th>

                      <td className="py-4 px-6 text-beer-blonde font-semibold ">
                        {product.name}
                      </td>

                      <td className="py-4 px-6 text-beer-blonde font-semibold hover:text-beer-draft">
                        <IconButton
                          onClick={() => handleClick(product)}
                          icon={faHandPointer}
                          title={"Select element"}
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
    </Modal>
  );
}
