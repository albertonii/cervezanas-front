"use client";

import React, { useState } from "react";
import OriginInfo from "./OriginInfo";
import CoverageAreas from "./CoverageAreas";
import DistributionCost from "./distribution_costs/DistributionCost";
import HorizontalMenuLogistics from "./HorizontalMenuLogistics";
import { DistributionOption } from "../../../../../../lib/enums";

// interface Props {
//   coverageArea: Database["public"]["Tables"]["coverage_areas"]["Row"];
// }

export default function CoverageLayout() {
  const [menuOption, setMenuOption] = useState<string>(DistributionOption.COST);

  const renderSwitch = () => {
    switch (menuOption) {
      case DistributionOption.ORIGIN_INFORMATION:
        return <OriginInfo />;

      case DistributionOption.COST:
        return <DistributionCost />;

      case DistributionOption.DESTINATION:
        return <CoverageAreas />;

      default:
        return <></>;
    }
  };

  return (
    <section className="container space-y-4 px-1 py-1 sm:px-6 sm:py-4">
      <HorizontalMenuLogistics setMenuOption={setMenuOption} />

      {renderSwitch()}
    </section>
  );
}
