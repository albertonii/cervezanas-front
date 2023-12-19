"use client";

import useFetchDistributionByOwnerId from "../../../../../../hooks/useFetchDistribution";
import CityDistribution from "./(city)/CityDistribution";
import HorizontalMenu from "./HorizontalMenuCoverageDestination";
import ProvinceDistribution from "./(province)/ProvinceDistribution";
import InternationalDistribution from "./(international)/InternationalDistribution";
import EuropeDistribution from "./(europe)/EuropeDistribution";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { DistributionDestinationType } from "../../../../../../lib/enums";

export default function CoverageAreas() {
  const t = useTranslations();
  const [menuOption, setMenuOption] = useState<string>(
    DistributionDestinationType.CITY
  );

  const { data: distribution, error } = useFetchDistributionByOwnerId();

  if (error) {
    console.error(error);
  }

  // TODO: Hay que buscar una forma de normalizar los nombres de los paises
  // para puedan estar autoseleccionados al momento de recibir el listado de países que
  // tiene el distribuidor. Si lo hacemos de la manera de abajo
  // hay causíticas que no ten<zemos en cuenta: Bosnia and Herzegovina no se marcaría
  const internationalCountries =
    distribution?.coverage_areas[0].international.map((country) => {
      return country.replace(/\w\S*/g, (txt) => {
        return txt.replace(/\b\w/g, (v) => v.toUpperCase());
      });
    }) ?? [];

  const renderSwitch = () => {
    switch (menuOption) {
      case DistributionDestinationType.LOCAL:
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

      case DistributionDestinationType.CITY:
        return (
          <>
            {distribution && (
              <CityDistribution
                cities={distribution.coverage_areas[0].cities}
              />
            )}
          </>
        );

      case DistributionDestinationType.PROVINCE:
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

      case DistributionDestinationType.REGION:
        return <span>Region</span>;

      case DistributionDestinationType.EUROPE:
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

      case DistributionDestinationType.INTERNATIONAL:
        return (
          <>
            {distribution && (
              <InternationalDistribution
                countries={internationalCountries}
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
    <fieldset className="w-full rounded-xl border border-beer-softBlondeBubble border-b-gray-200 bg-beer-foam p-4">
      <legend className="text-2xl font-medium text-beer-dark">
        {t("distribution_destination")}
      </legend>

      {/* Horizontal menu  */}
      <HorizontalMenu setMenuOption={setMenuOption} />

      {/* Coverage Area content  */}
      <section>{renderSwitch()}</section>

      {/* Map Area Content  */}
    </fieldset>
  );
}
