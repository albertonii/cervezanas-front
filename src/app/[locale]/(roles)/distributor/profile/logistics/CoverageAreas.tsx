import useFetchDistributionByOwnerId from "../../../../../../hooks/useFetchDistribution";
import CityDistribution from "./(city)/CityDistribution";
import LocalDistribution from "./(local)/LocalDistribution";
import HorizontalMenu from "./HorizontalMenu";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { DistributionType } from "../../../../../../lib/enums";
import ProvinceDistribution from "./(province)/ProvinceDistribution";

export default function CoverageAreas() {
  const t = useTranslations();
  const [menuOption, setMenuOption] = useState<string>("local");

  const {
    data: distribution,
    error,
    isLoading,
    isFetching,
  } = useFetchDistributionByOwnerId();

  if (error) {
    console.error(error);
  }

  if (isLoading || isFetching) {
    return <span>Loading...</span>;
  }

  const renderSwitch = () => {
    switch (menuOption) {
      case DistributionType.LOCAL:
        return (
          <>
            {distribution && (
              <LocalDistribution
                localDistribution={
                  distribution.coverage_area[0].local_distribution
                }
              />
            )}
          </>
        );
      case DistributionType.CITY:
        return (
          <>
            {distribution && (
              <CityDistribution cities={distribution.coverage_area[0].cities} />
            )}
          </>
        );
      case DistributionType.PROVINCE:
        return (
          <>
            {distribution && (
              <ProvinceDistribution
                provinces={distribution?.coverage_area[0].provinces}
              />
            )}
          </>
        );
      case DistributionType.REGION:
        return <span>asdf</span>;
      case DistributionType.EUROPE:
        return <span>Europe</span>;
      case DistributionType.INTERNATIONAL:
        return <span>international</span>;
      default:
        return <span>local</span>;
    }
  };

  return (
    <fieldset className="w-full rounded-md border-2 border-beer-softBlondeBubble p-4">
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
