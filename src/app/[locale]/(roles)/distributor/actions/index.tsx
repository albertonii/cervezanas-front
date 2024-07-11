'use server';

import axios from 'axios';
import {
    IAreaAndWeightCostRange,
    ICoverageArea_,
    IFlatrateAndWeightCostForm,
} from '../../../../../lib/types/types';
import createServerClient from '../../../../../utils/supabaseServer';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function calculateFlatrateAndWeightShippingCost(
    distributionCostId: string,
    totalWeight: number,
    costExtraPerKG: number,
) {
    const supabase = await createServerClient();

    const { data: costRanges, error } = await supabase
        .from('flatrate_and_weight_cost')
        .select(
            `
                distribution_costs_id,
                created_at,
                weight_from,
                weight_to,
                base_cost,
                updated_at
            `,
        )
        .eq('distribution_costs_id', distributionCostId)
        .order('weight_from', { ascending: true });

    if (error) {
        throw new Error('Error fetching cost ranges');
    }

    let shippingCost = 0;

    if (costRanges === null) {
        throw new Error('No cost ranges found');
    }

    for (let i = 0; i < costRanges.length; i++) {
        const range = costRanges[i];

        if (
            range.weight_from === null ||
            range.weight_to === null ||
            range.base_cost === null
        ) {
            continue;
        }

        if (totalWeight > range.weight_to) {
            // El peso excede el rango actual, por lo que calculamos el coste total para este rango
            shippingCost =
                range.base_cost +
                (totalWeight - range.weight_to) * costExtraPerKG;
        } else if (
            totalWeight >= range.weight_from &&
            totalWeight <= range.weight_to
        ) {
            // El peso está dentro del rango actual, aplicamos el coste para el peso dentro del rango
            shippingCost = range.base_cost;

            break; // Una vez encontrado el rango aplicable, salimos del bucle
        }
    }

    return shippingCost;
}

export async function updateFlatrateAndWeightShippingCost(
    cost_extra_per_kg: number,
    distribution_costs_id: string,
    flatrateWeightCostRange: IFlatrateAndWeightCostForm[],
) {
    // const urlDELETE = `${baseUrl}/api/distribution_costs/flatrate_and_weight_cost?distribution_costs_id=${distribution_costs_id}`;
    // Delete all the previous cost ranges
    // const resDelete = await fetch(urlDELETE, {
    //     method: 'DELETE',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // });

    // if (!resDelete.ok) {
    //     return {
    //         status: resDelete.status,
    //         message: 'Error deleting previous cost ranges',
    //     };
    // }

    // Delete this way because there is a BUG calling DELETE from route.ts
    const resDelete = await flatrateAndWeightCostRangeDelete(
        distribution_costs_id,
    );

    if (resDelete.status !== 200) {
        return {
            status: resDelete.status,
            message: resDelete.message,
        };
    }

    const urlPOST = `${baseUrl}/api/distribution_costs/flatrate_and_weight_cost`;

    // Insert the new cost ranges
    const formData = new FormData();

    formData.append('distribution_costs_id', distribution_costs_id);
    flatrateWeightCostRange.forEach((range, index) => {
        formData.append(
            `flatrate_weight[${index}].weight_from`,
            range.weight_from.toString(),
        );
        formData.append(
            `flatrate_weight[${index}].weight_to`,
            range.weight_to.toString(),
        );
        formData.append(
            `flatrate_weight[${index}].base_cost`,
            range.base_cost.toString(),
        );
    });

    formData.append(
        'flatrate_weight_size',
        flatrateWeightCostRange.length.toString(),
    );

    formData.append('cost_extra_per_kg', cost_extra_per_kg.toString());

    const resPost = await fetch(urlPOST, {
        method: 'POST',
        body: formData,
    });

    if (!resPost.ok) {
        return {
            status: resPost.status,
            message: 'Error inserting new cost ranges',
        };
    }

    return {
        status: resPost.status,
        message: 'Flatrate and weight cost updated successfully',
    };
}

async function flatrateAndWeightCostRangeDelete(distributionCostsId: string) {
    const supabase = await createServerClient();

    // Get all the flatrate and weight costs rows linked with the distribution_costs_id
    const { data: flatrateAndWeightCosts, error: flatrateAndWeightCostsError } =
        await supabase
            .from('flatrate_and_weight_cost')
            .select('id')
            .eq('distribution_costs_id', distributionCostsId);

    if (flatrateAndWeightCostsError) {
        return {
            status: 500,
            message: 'Error fetching flatrate and weight costs',
        };
    }

    // Delete all previos flatrate and weight costs linked with the distribution_costs_id
    flatrateAndWeightCosts.map(async (flatrateAndWeightCost) => {
        const { error: deleteError } = await supabase
            .from('flatrate_and_weight_cost')
            .delete()
            .eq('id', flatrateAndWeightCost.id);
        if (deleteError) {
            return {
                status: 500,
                message: 'Error deleting flatrate and weight costs',
            };
        }
    });

    return {
        status: 200,
        message: 'Flatrate and weight costs deleted successfully',
    };
}

export async function updateIsDistributionCostsIncludedInProduct(
    distribution_costs_id: string,
    isDistributionCostIncluded: boolean,
) {
    const formData = new FormData();

    formData.append('distribution_costs_id', distribution_costs_id);
    formData.append(
        'distribution_costs_in_product',
        isDistributionCostIncluded.toString(),
    );

    const urlPUT = `${baseUrl}/api/distribution_costs/distribution_costs_in_product`;

    const resPut = await fetch(urlPUT, {
        method: 'PUT',
        body: formData,
    });

    if (!resPut.ok) {
        return {
            status: resPut.status,
            message: 'Error updating is_distribution_costs_in_product',
        };
    }

    return {
        status: resPut.status,
        message: 'is_distribution_costs_in_product updated successfully',
    };
}

export async function updateAreaAndWeightRangeByAreaAndWeightInformationId(
    area_weight_range: IAreaAndWeightCostRange[],
) {
    const formData = new FormData();

    area_weight_range.forEach((range, index) => {
        formData.append(
            `area_weight_range[${index}].weight_from`,
            range.weight_from.toString(),
        );
        formData.append(
            `area_weight_range[${index}].weight_to`,
            range.weight_to.toString(),
        );
        formData.append(
            `area_weight_range[${index}].base_cost`,
            range.base_cost.toString(),
        );
        formData.append(
            `area_weight_range[${index}].area_and_weight_information_id`,
            range.area_and_weight_information_id,
        );
    });

    formData.append(
        'area_weight_range_size',
        area_weight_range.length.toString(),
    );

    const urlPUT = `${baseUrl}/api/distribution_costs/area_and_weight_cost`;

    const resPut = await fetch(urlPUT, {
        method: 'PUT',
        body: formData,
    });

    if (!resPut.ok) {
        return {
            status: resPut.status,
            message: 'Error updating area_weight_range',
        };
    }

    return {
        status: resPut.status,
        message: 'area_weight_range updated successfully',
    };
}

export async function updateCityDistribution(
    unCheckedCities: string[],
    newSelectedCities: string[],
    selectedCities: string[],
    coverageAreaId: string,
    areaAndWeightId: string,
) {
    const url = `${baseUrl}/api/coverage_areas/cities`;

    const formData = new FormData();

    formData.append('to_delete_cities', JSON.stringify(unCheckedCities));
    formData.append('to_add_cities', JSON.stringify(newSelectedCities));
    formData.append('cities', JSON.stringify(selectedCities));
    formData.append('coverage_area_id', coverageAreaId);
    formData.append('area_and_weight_cost_id', areaAndWeightId);

    // CORS

    try {
        const response = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers':
                    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
            },
        });

        if (
            response.status !== 200 &&
            response.status !== 201 &&
            response.status !== 202
        ) {
            return {
                status: response.status,
                message:
                    response.data.message || 'Error updating city distribution',
            };
        }

        return {
            status: response.status,
            message: 'City distribution updated successfully',
        };
    } catch (error: any) {
        console.error('Error updating city distribution:', error);
        return {
            status: error.response?.status || 500,
            message: error.response?.data.message || 'Internal Server Error',
        };
    }
}

export async function updateSubRegionDistribution(
    unCheckedSubRegions: ICoverageArea_[],
    newSelectedSubRegions: ICoverageArea_[],
    selectedSubRegions: ICoverageArea_[],
    areaAndWeightCostId: string,
) {
    const url = `${baseUrl}/api/coverage_areas/sub_regions`;

    const formData = new FormData();

    formData.append(
        'to_delete_sub_regions',
        JSON.stringify(unCheckedSubRegions),
    );
    formData.append(
        'to_add_sub_regions',
        JSON.stringify(newSelectedSubRegions),
    );
    formData.append('sub_regions', JSON.stringify(selectedSubRegions));
    formData.append('area_and_weight_cost_id', areaAndWeightCostId);

    try {
        const response = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers':
                    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
            },
        });

        if (
            response.status !== 200 &&
            response.status !== 201 &&
            response.status !== 202
        ) {
            return {
                status: response.status,
                message:
                    response.data.message ||
                    'Error updating sub_region distribution',
            };
        }

        return {
            status: response.status,
            message: 'SubRegion distribution updated successfully',
        };
    } catch (error: any) {
        console.error('Error updating sub_region distribution:', error);
        return {
            status: error.response?.status || 500,
            message: error.response?.data.message || 'Internal Server Error',
        };
    }
}

export async function updateRegionDistribution(
    unCheckedRegions: string[],
    newSelectedRegions: string[],
    selectedRegions: string[],
    coverageAreaId: string,
    areaAndWeightCostId: string,
) {
    const url = `${baseUrl}/api/coverage_areas/regions`;

    const formData = new FormData();

    formData.append('to_delete_regions', JSON.stringify(unCheckedRegions));
    formData.append('to_add_regions', JSON.stringify(newSelectedRegions));
    formData.append('regions', JSON.stringify(selectedRegions));
    formData.append('coverage_area_id', coverageAreaId);
    formData.append('area_and_weight_cost_id', areaAndWeightCostId);

    try {
        const response = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers':
                    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
            },
        });

        if (
            response.status !== 200 &&
            response.status !== 201 &&
            response.status !== 202
        ) {
            return {
                status: response.status,
                message:
                    response.data.message ||
                    'Error updating region distribution',
            };
        }

        return {
            status: response.status,
            message: 'Region distribution updated successfully',
        };
    } catch (error: any) {
        console.error('Error updating region distribution:', error);
        return {
            status: error.response?.status || 500,
            message: error.response?.data.message || 'Internal Server Error',
        };
    }
}

export async function handleSelectedDistributionCostType(
    type: string,
    distributionCostsId: string,
) {
    const url = `${baseUrl}/api/distribution_costs/distribution_cost_type`;

    const formData = new FormData();

    formData.append('distribution_costs_id', distributionCostsId);
    formData.append('distribution_cost_type', type);

    try {
        const response = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers':
                    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
            },
        });

        if (
            response.status !== 200 &&
            response.status !== 201 &&
            response.status !== 202
        ) {
            return {
                status: response.status,
                message:
                    response.data.message ||
                    'Error updating distribution cost type',
            };
        }

        return {
            status: response.status,
            message: 'Distribution cost type updated successfully',
        };
    } catch (error: any) {
        console.error('Error updating distribution cost type:', error);
        return {
            status: error.response?.status || 500,
            message: error.response?.data.message || 'Internal Server Error',
        };
    }
}
