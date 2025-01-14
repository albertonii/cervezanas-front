import axios from 'axios';
import {
    IDistributionContract,
    IProductPackCartItem,
    IShippingInfo,
} from '@/lib/types/types';

export interface ShippingResultForProducer {
    items: IProductPackCartItem[];
    shippingCost: number;
    distributor_id: string;
}

export type ProducerShippingCostMap = {
    [producerId: string]: ShippingResultForProducer;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * Retorna el coste de envío para todos los producers en items.
 * Calcula el distribuidor más barato que cubra la dirección dada.
 */
export async function getCheapestShippingForAllProducers(
    items: IProductPackCartItem[],
    shippingInfoId: string,
): Promise<ProducerShippingCostMap> {
    if (!items?.length || !shippingInfoId) return {};

    const shippingInfo = await getShippingInfo(shippingInfoId);
    const itemsByProducer = groupItemsByProducer(items);

    // 1) Obtener la lista de distribuidores para cada producer
    // (opcionalmente, traerlo en un solo request con un "producer_id in (..)" si la BD lo permite)
    const result: ProducerShippingCostMap = {};

    for (const [producerId, producerItems] of Object.entries(itemsByProducer)) {
        // A. Distribuidores que cubren la dirección
        const distributors = await getAvailableDistributorsForProducer(
            itemsByProducer,
            shippingInfo,
        );

        // B. Cálculo del shipping cost
        const shippingCostInfo =
            await calculateCheapestShippingCostsByDistributor(
                producerItems,
                shippingInfo,
                distributors,
            );

        if (
            !shippingCostInfo ||
            !shippingCostInfo.delivery_cost ||
            !shippingCostInfo.distributor_id
        ) {
            console.error('No shipping cost found');
            continue;
        }

        // C. Asigna el distributorId al item
        const updatedItems = producerItems
            .map((item) => ({
                ...item,
                distributor_id: shippingCostInfo.distributor_id!,
            }))
            .filter((item) => item.distributor_id !== null);

        result[producerId] = {
            items: updatedItems,
            shippingCost: shippingCostInfo.delivery_cost,
            distributor_id: shippingCostInfo.distributor_id,
        };
    }

    return result;
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

/**
 * En base a una serie de productos que comparten el mismo distribuidor, vamos a buscar cual es el que ofrezca un precio más económico
 */
export async function calculateCheapestShippingCostsByDistributor(
    itemsByProducer: IProductPackCartItem[],
    shippingInfo: IShippingInfo,
    distributionContracts: IDistributionContract[],
) {
    const urlCalculateShipping = `${baseUrl}/api/calculate_shipping`;

    // Sumar el peso total de los productos
    const totalWeight = await Promise.all(
        itemsByProducer.map(async (productPack) => {
            return await calculateProductPacksWeight(productPack);
        }),
    ).then((weights) => weights.reduce((prev, current) => prev + current, 0));

    // Obtener el costo de envío de cada distribuidor
    const shippingCostInformation: {
        distributor_id: string | null;
        delivery_cost: number | null;
    }[] = await Promise.all(
        distributionContracts.map(async (distributionContract) => {
            try {
                if (
                    distributionContract.distributor_user?.distribution_costs
                        ?.distribution_costs_in_product
                ) {
                    return {
                        distributor_id: distributionContract.distributor_id,
                        delivery_cost: 0,
                    };
                }

                const response = await axios.get(urlCalculateShipping, {
                    params: {
                        distributor_id: distributionContract.distributor_id,
                        total_weight: totalWeight,
                        address: shippingInfo.address,
                        city: shippingInfo.city,
                        sub_region: shippingInfo.sub_region,
                        region: shippingInfo.region,
                        country: shippingInfo.country,
                    },
                });

                if (response.data && response.data.cost !== undefined) {
                    return {
                        distributor_id: distributionContract.distributor_id,
                        delivery_cost: response.data.cost,
                    };
                } else {
                    console.error('Error fetching shipping costs', null);
                    return {
                        distributor_id: null,
                        delivery_cost: null,
                        reason: 'CONFIG_ERROR',
                    };
                }
            } catch (error) {
                console.error('Error fetching shipping costs', error);
                return {
                    distributor_id: null,
                    delivery_cost: null,
                    reason: 'CONFIG_ERROR',
                };
            }
        }),
    );

    // Filtrar solo los costos válidos
    const validShippingCosts: {
        distributor_id: string | null;
        delivery_cost: number | null;
    }[] = shippingCostInformation.filter(
        (
            shippingItem,
        ): shippingItem is {
            distributor_id: string | null;
            delivery_cost: number | null;
        } =>
            shippingItem !== null &&
            shippingItem.delivery_cost !== null &&
            shippingItem.distributor_id !== null,
    );

    if (validShippingCosts.length === 0) {
        console.info('No valid shipping costs found');
        return {
            distributor_id: null,
            delivery_cost: null,
            reason: 'NO_VALID_SHIPPING_COSTS',
        };
    }

    // Obtener el costo de envío más económico
    const cheapestShippingCost =
        validShippingCosts.length === 1
            ? validShippingCosts[0]
            : validShippingCosts.reduce((prev, current) =>
                  prev.delivery_cost! < current.delivery_cost! ? prev : current,
              );

    return cheapestShippingCost;
}

export function calculateProductPacksWeight(productPack: IProductPackCartItem) {
    if (!productPack.products) {
        console.warn(
            `No product info found for product_id=${productPack.product_id}, weight=0.`,
        );
        return 0;
    }

    if (!productPack.products.weight) {
        console.info(
            `Product weight is null or 0 for product_id=${productPack.product_id}.`,
        );
        // Podrías retornarlo como 0, o incluso "romper" si no quieres permitir ventas sin peso
        return 0;
    }

    const pack = productPack.packs[0];

    if (!pack) {
        console.warn('No pack found');
        return 0;
    }

    const packQuantity = pack.quantity;

    const packWeight = productPack.products.weight ?? 0;

    if (!packWeight) {
        console.info(
            `Weight not provided in productId=${productPack.product_id}, setting 0`,
        );
    }

    const totalWeight = packWeight * packQuantity;

    // Convert gr to KG
    return totalWeight / 1000;
}

export function groupItemsByProducer(items: IProductPackCartItem[]) {
    return items.reduce((acc, item) => {
        if (!acc[item.producer_id]) {
            acc[item.producer_id] = [];
        }
        acc[item.producer_id].push(item);
        return acc;
    }, {} as { [producerId: string]: IProductPackCartItem[] });
}

// Por cada productor, necesitamos saber cuales son los distribuidores que están asociados a él
// y que pueden enviar los productos a la dirección de envío seleccionada
export async function getAvailableDistributorsForProducer(
    itemsByProducer: { [producerId: string]: IProductPackCartItem[] },
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
        for (const contract of listOfDistributorsContracts) {
            if (!contract.distributor_user) continue;

            const distributorCoverage =
                contract.distributor_user.coverage_areas || [];
            const canDeliver = await isAddressCoveredByDistributor(
                distributorCoverage,
                shippingInfo,
            );

            if (canDeliver) {
                availableDistributorContracts.push(contract);
            }

            // const canDeliver = await canDistributorDeliverToAddress(
            //     distributorContract.distributor_user,
            //     shippingInfo,
            // );

            // if (canDeliver) {
            //     availableDistributorContracts.push(distributorContract);
            // }
        }
    }

    return availableDistributorContracts;
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

export async function isAddressCoveredByDistributor(
    // distributorCoverage: IDistributorCoverageArea[],
    distributorCoverage: any[],
    clientShippingInfo: IShippingInfo,
): Promise<boolean> {
    if (!distributorCoverage || distributorCoverage.length === 0) {
        return false;
    }

    // Verificar si alguna de las áreas de cobertura coincide con la información de envío
    return distributorCoverage.some((area) => {
        const isCountryMatch =
            area.country.toLowerCase() ===
            clientShippingInfo.country.toLowerCase();
        const isRegionMatch =
            area.region.toLowerCase() ===
            clientShippingInfo.region.toLowerCase();
        const isSubRegionMatch =
            area.sub_region.toLowerCase() ===
            clientShippingInfo.sub_region.toLowerCase();

        // Verificar si se requiere nivel de ciudad
        const isCityMatch = area.city
            ? area.city.toLowerCase() === clientShippingInfo.city.toLowerCase()
            : true;

        return (
            isCountryMatch && isRegionMatch && isSubRegionMatch && isCityMatch
        );
    });
}

// TO DO: en caso de que existan cupones que descuenten en el envío, entrar aquí.
export function applyCouponToShipping(
    promoCode: string | null,
    deliveryCost: number,
) {
    if (!promoCode) return 0; // Sin cupón = sin descuento

    // Ejemplo de cupón que descuenta el 50% del envío
    if (promoCode === 'DESCUENTO_ENVIO_50') {
        return deliveryCost * 0.5;
    }

    // Cupón de envío gratis
    if (promoCode === 'ENVIOGRATIS') {
        return deliveryCost;
    }

    return 0;
}
