import Lots from "./Lots";
import Archive from "./Archive";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Products } from "./Products";
import { Product, ProductLot } from "../../../lib/types";
import { CustomizeSettings } from "..";

interface Props {
  products: Product[];
  lots: ProductLot[];
}

export function ConfigureProducts({ products: p, lots }: Props) {
  const { t } = useTranslation();
  const [menuOption, setMenuOption] = useState<string>("products");
  const [activeTab, setActiveTab] = useState<string>("products");
  const [products, setProducts] = useState<Product[]>(p);

  const handleSetProducts = (value: Product[]) => {
    setProducts(value);
  };

  const renderSwitch = () => {
    switch (menuOption) {
      case "products":
        return (
          <Products products={products} handleSetProducts={handleSetProducts} />
        );
      case "lots":
        return <Lots products={products} lots={lots} />;
      case "archive":
        return (
          <Archive products={products} handleSetProducts={handleSetProducts} />
        );
      case "customizeSettings":
        return <CustomizeSettings />;
    }
  };

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
    setActiveTab(opt);
  };

  return (
    <>
      <div className="" aria-label="Products Submenu">
        <ul className="pl-72 pr-6 pb-6 hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
          <li
            className={`
          ${
            activeTab === "products"
              ? "bg-gray-100  text-gray-900"
              : "bg-beer-foam"
          }
          w-full flex items-center justify-center p-4 rounded-l-lg focus:ring-4 hover:cursor-pointer focus:ring-beer-blonde hover:bg-gray-50 hover:text-gray-700 active focus:outline-none dark:bg-gray-700 dark:text-white`}
            onClick={() => handleMenuClick("products")}
          >
            {t("products")}
          </li>

          <li
            className={`
          ${activeTab === "lots" ? "bg-gray-100 text-gray-900" : "bg-beer-foam"}
          w-full flex items-center justify-center p-4 hover:cursor-pointer hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-beer-blonde focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
            onClick={() => handleMenuClick("lots")}
          >
            {t("lots")}
          </li>

          <li
            className={`
          ${
            activeTab === "archive"
              ? "bg-gray-100 text-gray-900"
              : "bg-beer-foam"
          }
          w-full rounded-r-lg flex items-center justify-center p-4 hover:cursor-pointer hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-beer-blonde focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
            onClick={() => handleMenuClick("archive")}
          >
            {t("archive")}
          </li>

          <li
            className={`
          ${
            activeTab === "customizeSettings"
              ? "bg-gray-100 text-gray-900"
              : "bg-beer-foam"
          }
          w-full rounded-r-lg flex items-center justify-center p-4 hover:cursor-pointer hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-beer-blonde focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
            onClick={() => handleMenuClick("customizeSettings")}
          >
            {t("customizeSettings")}
          </li>
        </ul>
      </div>

      <div className="container">{renderSwitch()}</div>
    </>
  );
}
