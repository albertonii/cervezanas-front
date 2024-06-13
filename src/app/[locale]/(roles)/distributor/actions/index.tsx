'use server';

import { IFlatrateAndWeightCostForm } from '../../../../../lib/types/types';
import createServerClient from '../../../../../utils/supabaseServer';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function calculateFlatrateAndWeightShippingCost(
    distributor_id: string,
    total_weight: number,
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
                extra_cost_per_kg,
                updated_at
            `,
        )
        .eq('distributor_id', distributor_id)
        .order('weight_from', { ascending: true });

    if (error) {
        throw new Error('Error fetching distribution costs');
    }

    let shippingCost = 0;

    // for (let range of costRanges) {
    //     if (total_weight > range.weight_to) {
    //         shippingCost +=
    //             (range.weight_to - range.weight_from) *
    //                 range.extra_cost_per_kg +
    //             range.base_cost;
    //     } else if (total_weight > range.weight_from) {
    //         shippingCost +=
    //             (total_weight - range.weight_from) * range.extra_cost_per_kg +
    //             range.base_cost;
    //         break;
    //     }
    // }

    return shippingCost;
}

export async function updateFlatrateAndWeightShippingCost(
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
        formData.append(
            `flatrate_weight[${index}].extra_cost_per_kg`,
            range.extra_cost_per_kg.toString(),
        );
    });

    formData.append(
        'flatrate_weight_size',
        flatrateWeightCostRange.length.toString(),
    );

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
