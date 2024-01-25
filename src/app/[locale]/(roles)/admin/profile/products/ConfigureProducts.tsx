"use client";

import HorizontalSections from "../../../../components/common/HorizontalSections";
import React, { useState } from "react";
import { Products } from "./Products";

export function ConfigureProducts() {
  const [menuOption, setMenuOption] = useState<string>("products");

  const renderSwitch = () => {
    switch (menuOption) {
      case "products":
        return <Products />;
    }
  };

  const handleMenuClick = (opt: string): void => {
    setMenuOption(opt);
  };

  return (
    <>
      <HorizontalSections
        handleMenuClick={handleMenuClick}
        tabs={["products"]}
      />
      {renderSwitch()}
    </>
  );
}
