"use client";

import React, { useState } from "react";
import { DistributionCostType } from "../../../../../../../lib/enums";
import HorizontalMenuCoverageCost from "../HorizontalMenuCoverageCost";
import PriceRangeCostForm from "./PriceRangeCostForm";

export default function DistributionCost() {
  const [menuOption, setMenuOption] = useState<string>(
    DistributionCostType.FLATRATE
  );

  // Tarifa de envío por franja de peso del pedido (kg)
  // Tarifa de envío por franja de volumen del pedido (m3)
  // Tarifa de envío por franja de unidades del pedido (unidades)
  const renderSwitch = () => {
    switch (menuOption) {
      case DistributionCostType.RANGE:
        return <PriceRangeCostForm />;
      default:
        return <></>;
    }
  };

  return (
    <section className="space-y-4 rounded-xl border border-b-gray-200 bg-beer-foam p-4">
      <HorizontalMenuCoverageCost setMenuOption={setMenuOption} />

      {renderSwitch()}
    </section>
  );
}
