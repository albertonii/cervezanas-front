import Lots from "./Lots";
import Archive from "./Archive";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Products } from "./Products";
import {
  Product,
  ProductLot,
  CustomizeSettings as cSettings,
} from "../../../lib/types";
import { CustomizeSettings } from "..";
import HorizontalSections from "../../common/HorizontalSections";

interface Props {
  products: Product[];
  lots: ProductLot[];
  customizeSettings: cSettings;
}

export function ConfigureProducts({
  products: p,
  lots,
  customizeSettings: cSettings,
}: Props) {
  const [customizeSettings, setCustomizeSettings] =
    useState<cSettings>(cSettings);
  const { t } = useTranslation();
  const [menuOption, setMenuOption] = useState<string>("products");
  const [activeTab, setActiveTab] = useState<string>("products");
  const [products, setProducts] = useState<Product[]>(p);

  const handleSetProducts = (value: Product[]) => {
    setProducts(value);
  };

  const handleCustomizeSettings = (value: cSettings) => {
    setCustomizeSettings(value);
  };

  const renderSwitch = () => {
    switch (menuOption) {
      case "products":
        return (
          <Products
            products={products}
            handleSetProducts={handleSetProducts}
            customizeSettings={customizeSettings}
          />
        );
      case "lots":
        return <Lots products={products} lots={lots} />;
      case "archive":
        return (
          <Archive products={products} handleSetProducts={handleSetProducts} />
        );
      case "customizeSettings":
        return (
          <CustomizeSettings
            customizeSettings={customizeSettings}
            handleCustomizeSettings={handleCustomizeSettings}
          />
        );
    }
  };

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
    setActiveTab(opt);
  };

  return (
    <>
      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={["products", "lots", "archive", "customizeSettings"]}
      />

      <div className="container">{renderSwitch()}</div>
    </>
  );
}
