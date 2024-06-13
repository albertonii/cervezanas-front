'use server';

import createServerClient from '../../../../../utils/supabaseServer';

async function calculateFlatrateAndWeightShippingCost(
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
