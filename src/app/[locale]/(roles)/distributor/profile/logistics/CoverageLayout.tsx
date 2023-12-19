"use client";

import React from "react";
import OriginInfo from "./OriginInfo";
import CoverageAreas from "./CoverageAreas";

// interface Props {
//   coverageArea: Database["public"]["Tables"]["coverage_areas"]["Row"];
// }

export default function CoverageLayout() {
  return (
    <section className="container space-y-4 px-6 py-4 lg:space-y-20 lg:px-20 lg:py-16">
      <OriginInfo />
      {/* <CoverageAreas /> */}
    </section>
  );
}
