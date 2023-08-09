import HorizontalMenu from "./HorizontalMenu";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { DistributionType } from "../../../../../../lib/enums";
import LocalDistribution from "./LocalDistribution";
import useFetchDistributionByOwnerId from "../../../../../../hooks/useFetchDistribution";

export default function CoverageAreas() {
  const t = useTranslations();
  const [menuOption, setMenuOption] = useState<string>("products");

  const { data: distribution, error } = useFetchDistributionByOwnerId();

  if (error) {
    console.error(error);
  }

  const renderSwitch = () => {
    switch (menuOption) {
      case DistributionType.LOCAL:
        return (
          <>
            {distribution && (
              <LocalDistribution
                localDistribution={distribution.local_distribution}
              />
            )}
          </>
        );
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
    <fieldset className="rounded-md border-2 border-beer-softBlondeBubble p-4">
      <legend className="text-2xl font-medium text-beer-dark">
        {t("distribution_type")}
      </legend>

      {/* Horizontal menu  */}
      <HorizontalMenu setMenuOption={setMenuOption} />

      {/* Coverage Area content  */}
      <div>{renderSwitch()}</div>

      {/* Map Area Content  */}
    </fieldset>
  );
}
