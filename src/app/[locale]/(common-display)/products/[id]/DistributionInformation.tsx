import React, { useEffect, useState } from "react";
import useFetchDistributionContractsByProducerId from "../../../../../hooks/useFetchDistributionContractsByProducerId";
import {
  ICoverageArea,
  IDistributorUser,
  IProduct,
} from "../../../../../lib/types";

interface Props {
  product: IProduct;
}

export default function DistributionInformation({ product }: Props) {
  // Get the distribution information from the product
  const { owner_id: producerId } = product;

  const [distributor, setDistributor] = useState<IDistributorUser>();
  const { data: contracts } =
    useFetchDistributionContractsByProducerId(producerId);

  useEffect(() => {
    if (!contracts) return;
    setDistributor(contracts[0].distributor_id);
  }, [contracts]);

  if (!contracts) return null;

  return <div>{distributor?.coverage_areas[0].cities}</div>;
}

const isDistributionCities = (coverageAreas: ICoverageArea) => {
  return coverageAreas.cities.length > 0;
};

const isDistributionProvinces = (coverageAreas: ICoverageArea) => {
  return coverageAreas.provinces.length > 0;
};

const isDistributionRegions = (coverageAreas: ICoverageArea) => {
  return coverageAreas.regions.length > 0;
};

const isDistributionEurope = (coverageAreas: ICoverageArea) => {
  return coverageAreas.europe.length > 0;
};

const isDistributionInternational = (coverageAreas: ICoverageArea) => {
  return coverageAreas.international.length > 0;
};
