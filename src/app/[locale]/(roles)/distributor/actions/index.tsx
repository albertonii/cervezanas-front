'use server';

import {
    IAreaAndWeightCostRange,
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
            console.log('BASE COST', range.base_cost);
            console.log('Weight from', range.weight_from);
            console.log('Weight to ', range.weight_to);

            console.log('Diferencia de pesos', totalWeight - range.weight_to);
            console.log('Precio extra por kg', costExtraPerKG);

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

    console.log(area_weight_range);

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
