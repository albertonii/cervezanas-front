'use server';

import axios from 'axios';
import { API_METHODS, DS_API } from '@/constants';
import { DeliveryType } from '@/lib//enums';
import {
    IDistributionContract,
    IDistributorUser,
    IProductPackCartItem,
    IShippingInfo,
} from '@/lib//types/types';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function removeBillingAddressById(billingAddressId: string) {
    const url = `${baseUrl}/api/shopping_basket/billing_address`;

    const formData = new FormData();
    formData.set('billing_address_id', billingAddressId);

    const res = await fetch(url, {
        method: 'DELETE',
        body: formData,
    });

    return {
        status: res.status,
        message: res.statusText,
    };
}

export async function removeShippingAddressById(shippingAddressId: string) {
    const url = `${baseUrl}/api/shopping_basket/shipping_address`;

    const formData = new FormData();
    formData.set('shipping_address_id', shippingAddressId);

    const res = await fetch(url, {
        method: 'DELETE',
        body: formData,
    });

    return {
        status: res.status,
        message: res.statusText,
    };
}

export async function insertShippingAddress(form: {
    user_id: string;
    name: string;
    lastname: string;
    document_id: string;
    phone: string;
    address: string;
    address_extra?: string;
    address_observations?: string;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    zipcode: string;
    is_default: boolean;
}) {
    const {
        user_id,
        name,
        lastname,
        document_id,
        phone,
        address,
        address_extra,
        address_observations,
        country,
        region,
        sub_region,
        city,
        zipcode,
        is_default,
    } = form;

    const url = `${baseUrl}/api/shopping_basket/shipping_address`;

    const formData = new FormData();
    formData.set('user_id', user_id);
    formData.set('name', name);
    formData.set('lastname', lastname);
    formData.set('document_id', document_id);
    formData.set('phone', phone);
    formData.set('address', address);
    formData.set('address_extra', address_extra ?? '');
    formData.set('address_observations', address_observations ?? '');
    formData.set('country', country);
    formData.set('region', region);
    formData.set('sub_region', sub_region);
    formData.set('city', city);
    formData.set('zipcode', zipcode);
    formData.set('is_default', is_default.toString());

    const res = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    return {
        status: res.status,
        message: res.statusText,
    };
}

export async function insertBillingAddress(form: {
    user_id: string;
    name: string;
    lastname: string;
    document_id: string;
    phone: string;
    address: string;
    country: string;
    region: string;
    sub_region: string;
    city: string;
    zipcode: string;
    is_default: boolean;
}) {
    const {
        user_id,
        name,
        lastname,
        document_id,
        phone,
        address,
        country,
        region,
        sub_region,
        city,
        zipcode,
        is_default,
    } = form;

    const url = `${baseUrl}/api/shopping_basket/billing_address`;

    const formData = new FormData();
    formData.set('user_id', user_id);
    formData.set('name', name);
    formData.set('lastname', lastname);
    formData.set('document_id', document_id);
    formData.set('phone', phone);
    formData.set('address', address);
    formData.set('country', country);
    formData.set('region', region);
    formData.set('sub_region', sub_region);
    formData.set('city', city);
    formData.set('zipcode', zipcode);
    formData.set('is_default', is_default.toString());

    const res = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    return {
        status: res.status,
        message: res.statusText,
    };
}

interface InsertOnlineOrderProps {
    user_id: string;
    name: string;
    lastname: string;
    total: number;
    subtotal: number;
    delivery_cost: number;
    discount: number;
    discount_code: string;
    currency: string;
    order_number: string;
    type: string;
    tax: number;
    shipping_info_id: string;
    billing_info_id: string;
    items: IProductPackCartItem[];
}

export async function insertOnlineOrder(form: InsertOnlineOrderProps) {
    const url = `${baseUrl}/api/shopping_basket/online_order`;

    const formData = new FormData();

    formData.set('user_id', form.user_id);
    formData.set('name', form.name);
    formData.set('lastname', form.lastname);
    formData.set('total', form.total.toString());
    formData.set('subtotal', form.subtotal.toString());
    formData.set('delivery_cost', form.delivery_cost.toString());
    formData.set('discount', form.discount.toString());
    formData.set('discount_code', form.discount_code);
    formData.set('currency', form.currency);
    formData.set('order_number', form.order_number);
    formData.set('type', form.type);
    formData.set('tax', form.tax.toString());
    formData.set('shipping_info_id', form.shipping_info_id);
    formData.set('billing_info_id', form.billing_info_id);
    formData.set('items', JSON.stringify(form.items));

    const res = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    return {
        status: res.status,
        message: res.statusText,
    };
}

export async function getShippingInfoById(shippingInfoId: string) {
    const url = `${baseUrl}/api/shopping_basket/shipping_address?shipping_info_id=${shippingInfoId}`;

    const res = await fetch(url, {
        method: 'GET',
    });

    return {
        status: res.status,
        message: res.statusText,
    };
}

export async function validatePromoCode(code: string, userId: string) {
    const url = `${baseUrl}/api/shopping_basket/promo_code`;

    const formData = new FormData();
    formData.set('code', code);
    formData.set('user_id', userId);

    const res = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    const data = await res.json();

    return {
        status: res.status,
        data,
    };
}

export async function calculateProductPacksWeight(
    productPack: IProductPackCartItem,
) {
    const packQuantity = productPack.packs[0].quantity;
    const packWeight = productPack.products?.weight ?? 0;
    const totalWeight = packWeight * packQuantity;

    // Convert gr to KG
    return totalWeight / 1000;
}

/**
 * En base a una serie de productos que comparten el mismo distribuidor, vamos a buscar cual es el que ofrezca un precio más económico
 *
 * @param items
 * @param shippingInfoId
 * @param totalWeight
 */
export async function calculateCheapestShippingCosts(
    itemsByProducer: IProductPackCartItem[],
    shippingInfoId: string,
    distributionContracts: IDistributionContract[],
) {
    // Sumar el peso total de los productos
    const totalWeight = await Promise.all(
        itemsByProducer.map(async (productPack) => {
            return await calculateProductPacksWeight(productPack);
        }),
    ).then((weights) => weights.reduce((prev, current) => prev + current, 0));

    const url = `${baseUrl}/api/calculate_shipping`;

    // Obtener el costo de envío de cada distribuidor
    const shippingCosts = await Promise.all(
        distributionContracts.map(async (distributionContract) => {
            try {
                const response = await axios.get(url, {
                    params: {
                        distributor_id: distributionContract.distributor_id,
                        total_weight: totalWeight,
                        shipping_info_id: shippingInfoId,
                    },
                });

                if (response.data && response.data.cost !== undefined) {
                    return response.data;
                } else {
                    console.error(
                        'Error fetching shipping costs',
                        response.data,
                    );
                    return null;
                }
            } catch (error) {
                console.error('Error fetching shipping costs', error);
                return null;
            }
        }),
    );

    // Filtrar solo los costos válidos
    const validShippingCosts: { cost: number }[] = shippingCosts.filter(
        (cost) => cost !== null,
    );

    if (validShippingCosts.length === 0) {
        console.info('No valid shipping costs found');
        return null;
    }

    // Obtener el costo de envío más económico
    const cheapestShippingCost =
        validShippingCosts.length === 1
            ? validShippingCosts[0]
            : validShippingCosts.reduce((prev, current) =>
                  prev.cost < current.cost ? prev : current,
              );

    return cheapestShippingCost;
}

// Por cada productor, necesitamos saber cuales son los distribuidores que están asociados a él
// y que pueden enviar los productos a la dirección de envío seleccionada
export async function getListAsociatedDistributors(
    itemsByProducer: IProductPackCartItem[],
    shippingInfo: IShippingInfo,
) {
    // Array de distribuidores que tienen configurado en su área de cobertura la dirección de envío
    const availableDistributorContracts: IDistributionContract[] = [];

    for (const producerId in itemsByProducer) {
        // Get the list of distributors associated to the seller/producer of the product
        const listOfDistributorsContracts: IDistributionContract[] =
            await getListOfDistributorsBasedOnProducerId(producerId);

        // Check if the list of distributors is empty
        if (listOfDistributorsContracts.length === 0) {
            console.info('No distributors found');
            continue;
        }

        // Iterate through the list of distributors and check if they can deliver to the address
        // If so -> Add the distributor to the list of distributors
        for (const distributorContract of listOfDistributorsContracts) {
            if (!distributorContract.distributor_user) continue;

            const canDeliver = await canDistributorDeliverToAddress(
                distributorContract.distributor_user,
                shippingInfo,
            );

            if (canDeliver) {
                availableDistributorContracts.push(distributorContract);
            }
        }
    }

    return availableDistributorContracts;
}

export async function getShippingInfo(shippingInfoId: string) {
    const url = `${baseUrl}/api/calculate_shipping/shipping_info`;

    const response = await axios.get(url, {
        params: {
            shipping_info_id: shippingInfoId,
        },
    });

    // Throw exception if code status comes from error
    if (response.status >= 400 && response.status < 600) {
        throw new Error('Error fetching shipping info');
    }

    return response.data as IShippingInfo;
}

const getListOfDistributorsBasedOnProducerId = async (producerId: string) => {
    const url = `${baseUrl}/api/calculate_shipping/list_of_distributors_by_producer_id`;

    const response = await axios.get(url, {
        params: {
            producer_id: producerId,
        },
    });

    // Throw exception if code status comes from error
    if (response.status >= 400 && response.status < 600) {
        throw new Error('Error fetching list of distributors');
    }

    return response.data as IDistributionContract[];
};

export async function canDistributorDeliverToAddress(
    distributorUser: IDistributorUser,
    clientShippingInfo: IShippingInfo,
) {
    let canDeliver = false;

    // 1. Get coverage areas of the distributor
    if (!distributorUser || !distributorUser.coverage_areas)
        return {
            canDeliver,
            delivery_type: DeliveryType.NONE,
        };

    const coverageAreas = distributorUser.coverage_areas;

    // 2. Get Latitud and Longitud of client shipping address
    const address = `${clientShippingInfo.address}, ${clientShippingInfo.city}, ${clientShippingInfo.zipcode}, ${clientShippingInfo.country}`;
    const clientLatLng = await convertAddressToLatLng(address);

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
    // CITY -> SUBREGION/PROVINCE -> REGION/COMUNIDAD AUTONOMA -> INTERNATIONAL

    // CITY
    // if (coverageAreas.cities.length > 0) {
    //     // Check if the name of the city is in the list of cities of the distributor
    //     const city = clientShippingInfo.city;
    //     const cityNameInCoverageArea = coverageAreas.cities.includes(city);

    //     if (cityNameInCoverageArea) {
    //         // Check if the point [latitude, longitude] is inside the city
    //         canDeliver = await checkAddressIsInsideCityGeospatial(
    //             city,
    //             clientLatLng,
    //         );

    //         if (canDeliver) {
    //             return {
    //                 canDeliver: canDeliver,
    //             };
    //         }
    //     }
    // }

    // SUBREGION - PROVINCE
    // if (coverageAreas.sub_regions.length > 0) {
    //     // Check if the name of the subregion is in the list of subregions of the distributor
    //     const subregion = clientShippingInfo.sub_region;
    //     const subregionNameInCoverageArea =
    //         coverageAreas.sub_regions.includes(subregion);

    //     if (subregionNameInCoverageArea) {
    //         // Check if the point [latitude, longitude] is inside the subregion
    //         canDeliver = await checkAddressIsInsideSubregionGeospatial(
    //             subregion,
    //             clientLatLng,
    //         );

    //         if (canDeliver) {
    //             return {
    //                 canDeliver,
    //             };
    //         }
    //     }
    // }

    // // REGION - COMUNIDAD AUTONOMA
    // if (coverageAreas.regions.length > 0) {
    //     // Check if the name of the region is in the list of regions of the distributor
    //     const region = clientShippingInfo.region;
    //     canDeliver = coverageAreas.regions.includes(region);

    //     if (canDeliver) {
    //         return {
    //             canDeliver,
    //         };
    //     }
    // }

    // // INTERNATIONAL
    // if (coverageAreas.international) {
    //     // Check if the point [latitude, longitude] is inside the international area
    //     const country = clientShippingInfo.country;
    //     canDeliver = coverageAreas.international.includes(country);

    //     if (canDeliver) {
    //         return {
    //             canDeliver,
    //         };
    //     }
    // }

    return { canDeliver, delivery_type: DeliveryType.NONE };
}

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

const checkAddressIsInsideCityGeospatial = async (
    city: string,
    clientLatLng: google.maps.LatLng,
) => {
    const lat = clientLatLng.lat;
    const lng = clientLatLng.lng;
    const canDeliver = await isInsideCity(city, lat, lng);

    return canDeliver;
};

const checkAddressIsInsideSubregionGeospatial = async (
    subregion: string,
    clientLatLng: google.maps.LatLng,
) => {
    const canDeliver = await isInsideSubRegion(
        subregion,
        clientLatLng.lat,
        clientLatLng.lng,
    );

    return canDeliver;
};

const checkCanDeliverToAddressCities = async (
    cities: string[],
    clientLatLng: google.maps.LatLng,
) => {
    let canDeliver = false;

    for (const city of cities) {
        const lat = clientLatLng.lat;
        const lng = clientLatLng.lng;
        canDeliver = await isInsideCity(city, lat, lng);

        if (canDeliver) return canDeliver;
    }

    return canDeliver;
};

const isInsideCity = async (
    city: string,
    lat: () => number,
    lng: () => number,
) => {
    const ds_url = DS_API.DS_URL + DS_API.DS_CITIES + encodeURIComponent(city);

    const response = await fetch(`${ds_url}/inside?lat=${lat}&lng=${lng}`, {
        method: API_METHODS.GET,
    })
        .then(async (res) => {
            return await res.json();
        })
        .catch((error) => {
            console.error('Error:', error);
            return false;
        });

    try {
        const responseJson = JSON.parse(response);
        return responseJson;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

const isInsideSubRegion = async (
    subRegion: string,
    lat: () => number,
    lng: () => number,
) => {
    const ds_url =
        DS_API.DS_URL + DS_API.DS_PROVINCES + encodeURIComponent(subRegion);

    const response = await fetch(`${ds_url}/inside?lat=${lat}&lng=${lng}`, {
        method: API_METHODS.GET,
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Error:', error);
            return false;
        });

    try {
        const responseJson = JSON.parse(response);
        return responseJson;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};
