import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../../components/Auth";
import useFetchDistributionContractsByProducerId from "../../../../../hooks/useFetchDistributionContractsByProducerId";
import useFetchShippingByOwnerId from "../../../../../hooks/useFetchShippingByOwnerId";
import {
  ICoverageArea,
  IDistributorUser,
  IProduct,
  IShippingAddress,
} from "../../../../../lib/types";

interface Props {
  product: IProduct;
}

export default function DistributionInformation({ product }: Props) {
  // Get the distribution information from the product
  const { owner_id: producerId } = product;

  const [selectedAddress, setSelectedAddress] = useState<IShippingAddress>();

  const [distributor, setDistributor] = useState<IDistributorUser>();
  const { data: contracts } =
    useFetchDistributionContractsByProducerId(producerId);

  const { user } = useAuth();

  const {
    data: shippingAddresses,
    error: shippingAddressesError,
    isLoading: shippingAddressesLoading,
  } = useFetchShippingByOwnerId(user?.id);

  useEffect(() => {
    if (!contracts) return;
    setDistributor(contracts[0].distributor_id);
  }, [contracts]);

  if (!contracts) return null;

  return (
    <section className="space-y-4 rounded border-2 border-beer-softBlondeBubble p-2">
      <div>
        <h2>
          Select shipping address and check if this product is available for
          delivery to your location
        </h2>

        <select
          className="text-md w-full rounded-md border-2 border-beer-softBlondeBubble px-2 py-1 after:absolute after:top-4 after:right-4 after:w-36  focus:border-beer-blonde focus:bg-beer-softFoam focus:outline-none "
          id="is_external_organizer"
          onClick={(e: any) => {
            const value = e.target.value;
            shippingAddresses?.find((address: IShippingAddress) => {
              if (address.id === value) {
                setSelectedAddress(address);
              }
            });
          }}
        >
          <option key={1} value={1}>
            Select
          </option>
          {shippingAddresses?.map((address: IShippingAddress) => (
            <option key={address.id} value={address.id}>
              <div className="h-40 gap-2 space-x-2 p-4 ">
                <span>{address.address} </span>
                <span>{address.city} </span>
                <span>{address.state} </span>
                <span>{address.country} </span>
              </div>
            </option>
          ))}
        </select>
      </div>

      {/* Area with details of the address selected */}
      <div>
        <h3>Address details</h3>
        <p>{selectedAddress?.address}</p>
        <p>{selectedAddress?.city}</p>
        <p>{selectedAddress?.state}</p>
        <p>{selectedAddress?.country}</p>
      </div>
    </section>
  );
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