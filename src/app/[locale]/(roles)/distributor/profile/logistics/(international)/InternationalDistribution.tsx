import React from "react";
import InternationalDistributionPlaces from "./InternationalDistributionPlaces";

// interface ICountry {
//   id: string;
//   name: string;
//   isoCode: string;
// }

type Props = {
  countries: string[];
  coverageAreaId: string;
};

export default function InternationalDistribution({
  countries,
  coverageAreaId,
}: Props) {
  return (
    <section className="space-y-4 ">
      <InternationalDistributionPlaces
        countries={countries}
        coverageAreaId={coverageAreaId}
      />
    </section>
  );
}
