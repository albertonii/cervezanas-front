'use client';

import { API_METHODS, DS_API } from '../../../../../constants';
import { createBrowserClient } from '../../../../../utils/supabaseBrowser';
import {
    IDistributionContract,
    IShippingInfo,
} from '../../../../../lib/types/types';
import { DeliveryType, DistributionStatus } from '../../../../../lib/enums';

export const initShipmentLogic = async (
    shippingInfoId: string,
    producerId: string,
) => {
    // 1. Get Shipping Info
    const shippingInfo = await getShippingInfo(shippingInfoId);

    // 2. Get the list of distributors associated to the seller/producer of the product
    const listOfDistributorsContracts =
        await getListOfDistributorsBasedOnProducerId(producerId);

    if (listOfDistributorsContracts.length === 0)
        return {
            can_deliver: false,
            distributor_id: '',
            distribution_costs_id: '',
            delivery_type: DeliveryType.NONE,
            cost_extra_per_kg: 0,
        };

    // 3. Iterate through the list of distributors and check if they can deliver to the address. If one of them can, return true. If none of them can, return false.
    for (const distributor of listOfDistributorsContracts) {
        const { canDeliver, delivery_type } =
            await canDistributorDeliverToAddress(distributor, shippingInfo);

        if (canDeliver) {
            console.log(distributor.distributor_user);

            return {
                can_deliver: canDeliver,
                distributor_id: distributor.distributor_id,
                distribution_costs_id:
                    distributor.distributor_user.distribution_costs.id,
                delivery_type,
                cost_extra_per_kg:
                    distributor.distributor_user.distribution_costs
                        .cost_extra_per_kg,
            };
        }
    }

    return {
        can_deliver: false,
        distributor_id: '',
        distribution_costs_id: '',
        delivery_type: DeliveryType.NONE,
        cost_extra_per_kg: 0,
    };
};

const getShippingInfo = async (shippingInfoId: string) => {
    const supabase = createBrowserClient();

    const { data: shipping, error } = await supabase
        .from('shipping_info')
        .select(`*`)
        .eq('id', shippingInfoId)
        .single();

    if (error) throw error;

    return shipping as IShippingInfo;
};

const getListOfDistributorsBasedOnProducerId = async (producerId: string) => {
    const supabase = createBrowserClient();

    const { data: contracts, error } = await supabase
        .from('distribution_contracts')
        .select(
            `
                *,
                distributor_user!distribution_contracts_distributor_id_fkey (
                    *,
                    coverage_areas (*),
                    distribution_costs (id)
                )
            `,
        )
        .eq('producer_id', producerId)
        .eq('status', DistributionStatus.ACCEPTED);

    console.log(contracts);

    if (error) throw error;

    // return contracts as IDistributionContract[];
    return contracts as any[];
};

const canDistributorDeliverToAddress = async (
    dContract: IDistributionContract,
    clientShippingInfo: IShippingInfo,
) => {
    let canDeliver = false;

    // 1. Get coverage areas of the distributor
    if (
        !dContract.distributor_user ||
        !dContract.distributor_user.coverage_areas
    )
        return {
            canDeliver,
            delivery_type: DeliveryType.NONE,
        };

    const coverageAreas = dContract.distributor_user.coverage_areas;

    // 2. Get Latitud and Longitud of client shipping address
    const address = `${clientShippingInfo.address}, ${clientShippingInfo.city}, ${clientShippingInfo.zipcode}, ${clientShippingInfo.country}`;
    const clientLatLng = await convertAddressToLatLng(address);

    // a. International
    if (!clientLatLng) {
        console.error(
            'Error: Could not convert address to [latitude, longitude]',
        );
        return {
            canDeliver,
            delivery_type: DeliveryType.NONE,
        };
    }

    // 3. Check if the point [latitude, longitude] is in the coverage area. We need to check by priority order:
    // International -> Europe -> Region -> Province -> City -> Postal Code

    if (coverageAreas.international) {
        canDeliver = await canDistributorDeliverToAddressInternational(
            coverageAreas.international,
            clientLatLng,
        );

        if (canDeliver)
            return {
                canDeliver,
                delivery_type: DeliveryType.FLATRATE_INTERNATIONAL,
            };
    }

    // b. Europe
    if (coverageAreas.europe) {
        canDeliver = await canDistributorDeliverToAddressEurope(
            coverageAreas.international,
            clientLatLng,
        );

        if (canDeliver)
            return { canDeliver, delivery_type: DeliveryType.FLATRATE_EUROPE };
    }

    // c. Autonomous Communities

    // d. Province

    // e. City

    // f. Postal Code

    return { canDeliver, delivery_type: DeliveryType.NONE };
};

const canDistributorDeliverToAddressInternational = async (
    international: string[],
    clientLatLng: google.maps.LatLng,
) => {
    let canDeliver = false;
    for (const country of international) {
        const lat = clientLatLng.lat;
        const lng = clientLatLng.lng;
        canDeliver = await isInsideCountry(country, lat, lng);

        if (canDeliver) return canDeliver;
    }

    return canDeliver;
};

const canDistributorDeliverToAddressEurope = async (
    eruope: string[],
    clientLatLng: google.maps.LatLng,
) => {
    let canDeliver = false;
    for (const country of eruope) {
        const lat = clientLatLng.lat;
        const lng = clientLatLng.lng;
        canDeliver = await isInsideCountry(country, lat, lng);

        if (canDeliver) return canDeliver;
    }

    return canDeliver;
};

const canDistributorDeliverToAutonomousCommunity = async (
    aCommunities: string[],
    clientLatLng: google.maps.LatLng,
) => {
    let canDeliver = false;
    for (const community of aCommunities) {
        const lat = clientLatLng.lat;
        const lng = clientLatLng.lng;
        canDeliver = await isInsideCommunity(community, lat, lng);

        if (canDeliver) return canDeliver;
    }

    return canDeliver;
};

const convertAddressToLatLng = async (address: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // Construye la URL de la solicitud a la API de geocodificación de Google Maps.
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address,
    )}&key=${apiKey}`;

    const response = await fetch(apiUrl)
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });

    if (response.status !== 'OK') {
        return null;
    }

    const location = response.results[0].geometry.location;
    return location as google.maps.LatLng;
};

const isInsideCountry = async (
    country: string,
    lat: () => number,
    lng: () => number,
) => {
    const ds_url = DS_API.DS_URL + DS_API.DS_COUNTRIES + country;

    const data = await fetch(`${ds_url}/inside?lat=${lat}&lng=${lng}`, {
        method: API_METHODS.GET,
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Error:', error);
            return false;
        });

    return data;
};

const isInsideCommunity = async (
    community: string,
    lat: () => number,
    lng: () => number,
) => {
    const ds_url = DS_API.DS_URL + DS_API.DS_COMMUNITIES + community;

    const data = await fetch(`${ds_url}/inside?lat=${lat}&lng=${lng}`, {
        method: API_METHODS.GET,
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Error:', error);
            return false;
        });

    return data;
};
