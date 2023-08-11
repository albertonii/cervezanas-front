"use client";

import React from "react";
import { Database } from "../../../../../../lib/schema";
import CoverageAreas from "./CoverageAreas";
import OriginInfo from "./OriginInfo";

interface Props {
  coverageArea: Database["public"]["Tables"]["coverage_area"]["Row"];
}

export default function CoverageArea({ coverageArea }: Props) {
  return (
    <div className="container space-y-4 px-6 py-4 lg:space-y-20 lg:px-20 lg:py-16">
      <OriginInfo />
      <CoverageAreas />
    </div>
  );
}
