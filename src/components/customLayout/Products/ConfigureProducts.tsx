import Lots from "./Lots";
import Archive from "./Archive";
import React, { useState } from "react";
import { Products } from "./Products";
import {
  IProduct,
  IProductLot,
  CustomizeSettings as cSettings,
} from "../../../lib/types.d";
import { CustomizeSettings } from "..";
import HorizontalSections from "../../common/HorizontalSections";

interface Props {
  products: IProduct[];
  lots: IProductLot[];
  customizeSettings: cSettings;
}

export function ConfigureProducts({
  products: p,
  lots,
  customizeSettings: cSettings,
}: Props) {
  const [customizeSettings, setCustomizeSettings] =
    useState<cSettings>(cSettings);
  const [menuOption, setMenuOption] = useState<string>("products");
  const [products, setProducts] = useState<IProduct[]>(p);

  const handleSetProducts = (value: IProduct[]) => {
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
  };

  return (
    <>
      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={["products", "lots", "archive", "customizeSettings"]}
      />

      {renderSwitch()}
    </>
  );
}
