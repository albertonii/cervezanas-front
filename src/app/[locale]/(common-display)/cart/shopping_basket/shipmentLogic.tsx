"use client";

import useFetchCoverageAreaByDistributor from "./useFetchCoverageAreaByDistributor";
import { createClient } from "../../../../../utils/supabaseBrowser";
import { IDistributionContract, IShippingInfo } from "../../../../../lib/types";

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
        distributor_user!distribution_contracts_distributor_id_fkey (
            *,
            coverage_areas (*)
        )
    `
    )
    .eq("producer_id", distributionId);

  console.log(contracts);

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

  const coverageAreas = dContract.distributor_user.coverage_areas[0];

  // 2. Check if the address is in the coverage area. We need to check by priority order:
  // International -> Europe -> Region -> Province -> City -> Postal Code

  // a. International
  canDistributorDeliverToAddressInternational(coverageAreas.international);

  // b. Europe

  // c. Region

  // d. Province

  // e. City

  // f. Postal Code

  return true;
};

const canDistributorDeliverToAddressInternational = async (
  international: string[]
) => {
  console.log(international);

  for (const country of international) {
    const data = fetchShippingByOwnerId(country);

    console.log(data);
  }

  return true;
};

const fetchShippingByOwnerId = async (address: string) => {
  console.log(address);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Construye la URL de la solicitud a la API de geocodificación de Google Maps.
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OK") {
        console.log(data);
        const location = data.results[0].geometry.location;

        console.log(location);

        // Verifica si la ubicación está dentro de la zona de envío del vendedor.
        // Puedes agregar tu lógica de verificación aquí.
        const isWithinShippingZone = true; // Cambia esto según tu lógica real.

        // if (isWithinShippingZone) {
        //   document.getElementById("result").textContent =
        //     "Dirección de envío válida";
        // } else {
        //   document.getElementById("result").textContent =
        //     "Dirección de envío no válida";
        // }
      } else {
        // document.getElementById("result").textContent =
        //   "No se pudo verificar la dirección";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  return location;
};
