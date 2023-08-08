import HorizontalMenu from "./HorizontalMenu";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { DistributionType } from "../../../../../../lib/enums";
import LocalDistribution from "./LocalDistribution";

export default function CoverageAreas() {
  const t = useTranslations();
  const [menuOption, setMenuOption] = useState<string>("products");

  const renderSwitch = () => {
    switch (menuOption) {
      case DistributionType.LOCAL:
        return <LocalDistribution />;
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
      <div>
        <span>{t("distribution_type")}</span>
        {renderSwitch()}
      </div>

      {/* Map Area Content  */}
    </div>
  );
}
