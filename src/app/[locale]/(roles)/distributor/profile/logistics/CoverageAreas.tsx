import useFetchDistributionByOwnerId from "../../../../../../hooks/useFetchDistribution";
import CityDistribution from "./(city)/CityDistribution";
import HorizontalMenu from "./HorizontalMenu";
import ProvinceDistribution from "./(province)/ProvinceDistribution";
import InternationalDistribution from "./(international)/InternationalDistribution";
import EuropeDistribution from "./(europe)/EuropeDistribution";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { DistributionType } from "../../../../../../lib/enums";

export default function CoverageAreas() {
  const t = useTranslations();
  const [menuOption, setMenuOption] = useState<string>("city");

  const { data: distribution, error } = useFetchDistributionByOwnerId();

  if (error) {
    console.error(error);
  }

  const renderSwitch = () => {
    switch (menuOption) {
      case DistributionType.LOCAL:
        return (
          <>
            {/* {distribution && (
              <LocalDistribution
                localDistribution={
                  distribution.coverage_areas[0].local_distribution
                }
              />
            )} */}
          </>
        );

      case DistributionType.CITY:
        return (
          <>
            {distribution && (
              <CityDistribution
                cities={distribution.coverage_areas[0].cities}
              />
            )}
          </>
        );

      case DistributionType.PROVINCE:
        return (
          <>
            {distribution && (
              <ProvinceDistribution
                provinces={distribution?.coverage_areas[0].provinces}
                coverageAreaId={distribution.coverage_areas[0].id}
              />
            )}
          </>
        );

      case DistributionType.REGION:
        return <span>Region</span>;

      case DistributionType.EUROPE:
        return (
          <>
            {distribution && (
              <EuropeDistribution
                countries={distribution?.coverage_areas[0].europe}
                coverageAreaId={distribution.coverage_areas[0].id}
              />
            )}
          </>
        );

      case DistributionType.INTERNATIONAL:
        return (
          <>
            {distribution && (
              <InternationalDistribution
                countries={distribution?.coverage_areas[0].international}
                coverageAreaId={distribution.coverage_areas[0].id}
              />
            )}
          </>
        );
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
      <section className="border border-b-gray-200 bg-beer-foam  p-4">
        {renderSwitch()}
      </section>

      {/* Map Area Content  */}
    </fieldset>
  );
}
