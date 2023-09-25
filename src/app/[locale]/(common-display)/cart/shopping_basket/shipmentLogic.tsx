"use client";

import { IDistributionContract, IShippingInfo } from "../../../../../lib/types";
import { createClient } from "../../../../../utils/supabaseBrowser";

export const initShipmentLogic = async (
  shippingInfoId: string,
  producerId: string
) => {
  // 1. Get Shipping Info
  const shippingInfo = await getShippingInfo(shippingInfoId);

  // 2. Get the list of distributors associated to the seller/producer of the product
  const listOfDistributors = await getListOfDistributorsBasedOnProducerId(
    producerId
  );

  if (listOfDistributors.length === 0) return false;

  // 3. Iterate through the list of distributors and check if they can deliver to the address. If one of them can, return true. If none of them can, return false.
  for (const distributor of listOfDistributors) {
    const canDeliver = await canDistributorDeliverToAddress(
      distributor,
      shippingInfo
    );

    if (canDeliver) return true;
  }
};

const getShippingInfo = async (shippingInfoId: string) => {
  const supabase = createClient();

  const { data: shipping, error } = await supabase
    .from("shipping_info")
    .select(`*`)
    .eq("id", shippingInfoId)
    .single();

  if (error) throw error;

  return shipping as IShippingInfo;
};

const getListOfDistributorsBasedOnProducerId = async (
  distributionId: string
) => {
  const supabase = createClient();

  const { data: contracts, error } = await supabase
    .from("distribution_contracts")
    .select(
      `
        *,
        distributor_id,
        distributor_user!distributor_user_user_fkey (
            *
        )
    `
    )
    .eq("producer_id", distributionId);

  if (error) throw error;

  return contracts as IDistributionContract[];
};

const canDistributorDeliverToAddress = async (
  dContract: IDistributionContract,
  shippingInfo: IShippingInfo
) => {
  // 1. Get coverage areas of the distributor
  console.log(dContract.distributor_user);

  if (!dContract.distributor_user || !dContract.distributor_user.coverage_areas)
    return false;
  console.log(dContract.distributor_user);

  const coverageAreas = dContract.distributor_user.coverage_areas[0];
  console.log(coverageAreas);

  // 2. Check if the address is in the coverage area. We need to check by priority order:
  // International -> Europe -> Region -> Province -> City -> Postal Code

  // International
  canDistributorDeliverToAddressInternational(coverageAreas.international);

  return true;
};

const canDistributorDeliverToAddressInternational = async (
  international: string[]
) => {
  console.log(international);

  return true;
};
