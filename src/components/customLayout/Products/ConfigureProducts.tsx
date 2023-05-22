"use client";

import HorizontalSections from "../../common/HorizontalSections";
import React, { useState } from "react";
import { Products } from "./Products";
import { Archive, CustomizeSettings, Lots } from "..";

export function ConfigureProducts() {
  const [menuOption, setMenuOption] = useState<string>("products");

  const renderSwitch = () => {
    switch (menuOption) {
      case "products":
        return <Products />;
      case "lots":
        return <Lots />;
      case "archive":
        return <Archive />;
      case "customizeSettings":
        return <CustomizeSettings />;
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
