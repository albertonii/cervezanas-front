"use client";

import { createClient } from "../../../../../utils/supabaseBrowser";
import { IDistributionContract, IShippingInfo } from "../../../../../lib/types";
import { API_METHODS, DS_API } from "../../../../../constants";

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

  if (error) throw error;

  return contracts as IDistributionContract[];
};

const canDistributorDeliverToAddress = async (
  dContract: IDistributionContract,
  clientShippingInfo: IShippingInfo
) => {
  // 1. Get coverage areas of the distributor
  if (!dContract.distributor_user || !dContract.distributor_user.coverage_areas)
    return false;

  const coverageAreas = dContract.distributor_user.coverage_areas[0];

  // 2. Get Latitud and Longitud of client shipping address
  const address = `${clientShippingInfo.address}, ${clientShippingInfo.city}, ${clientShippingInfo.zipcode}, ${clientShippingInfo.country}`;
  const clientLatLng = await convertAddressToLatLng(address);

  // 3. Check if the point [latitude, longitude] is in the coverage area. We need to check by priority order:
  // International -> Europe -> Region -> Province -> City -> Postal Code

  // a. International
  if (!clientLatLng) {
    console.error("Error: Could not convert address to [latitude, longitude]");
    return false;
  }

  console.log(coverageAreas);

  canDistributorDeliverToAddressInternational(
    coverageAreas.international,
    clientLatLng
  );

  // b. Europe

  // c. Region

  // d. Province

  // e. City

  // f. Postal Code

  return true;
};

const canDistributorDeliverToAddressInternational = async (
  international: string[],
  clientLatLng: google.maps.LatLng
) => {
  for (const country of international) {
    const lat = clientLatLng.lat;
    const lng = clientLatLng.lng;
    isInsideCountry(country, lat, lng);
  }

  return true;
};

const convertAddressToLatLng = async (address: string) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Construye la URL de la solicitud a la API de geocodificación de Google Maps.
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  const response = await fetch(apiUrl)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });

  if (response.status === "OK") {
    const location = response.results[0].geometry.location;
    return location as google.maps.LatLng;
  }
  return null;
};

const isInsideCountry = async (
  country: string,
  lat: () => number,
  lng: () => number
) => {
  console.log(lat);
  const ds_url = DS_API.DS_URL + DS_API.DS_COUNTRIES + country;
  const data = await fetch(`${ds_url}/inside?lat=${lat}&lng=${lng}`, {
    method: API_METHODS.GET,
  }).then((res) => console.info(res));

  return data;
};

const isInsideCommunity = async (
  community: string,
  lat: number,
  lng: number
) => {
  const ds_url = DS_API.DS_URL + DS_API.DS_COMMUNITIES + community;
  const data = fetch(`${ds_url}/inside?lat=${lat}&lng=${lng}`, {
    method: API_METHODS.GET,
  }).then((res) => console.info(res));

  return data;
};
