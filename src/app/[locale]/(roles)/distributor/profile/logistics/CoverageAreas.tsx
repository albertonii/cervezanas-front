import React, { useState } from "react";
import { DistributionType } from "../../../../../../lib/enums";
import HorizontalMenu from "./HorizontalMenu";

export default function CoverageAreas() {
  const [menuOption, setMenuOption] = useState<string>("products");

  const renderSwitch = () => {
    switch (menuOption) {
      case DistributionType.LOCAL:
        return <span>Local</span>;
      case DistributionType.CITY:
        return <span>Cities</span>;
      case DistributionType.PROVINCE:
        return <span>Provinces</span>;
      case DistributionType.REGION:
        return <span>Regions</span>;
      case DistributionType.EUROPE:
        return <span>Europe</span>;
      case DistributionType.INTERNATIONAL:
        return <span>international</span>;
      default:
        return <span>local</span>;
    }
  };

  return (
    <div>
      {/* Horizontal menu  */}
      <HorizontalMenu setMenuOption={setMenuOption} />

      {/* Coverage Area content  */}
      {renderSwitch()}

      {/* Map Area Content  */}
    </div>
  );
}
