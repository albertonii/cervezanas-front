import createServerClient from '@/utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const distributionCostsId = searchParams.get('distribution_costs_id');

        if (!distributionCostsId) {
            return NextResponse.json(
                { message: 'Distribution cost ID is required' },
                { status: 400 },
            );
        }

        const supabase = await createServerClient();

        // Get all the flatrate and weight costs rows linked with the distribution_costs_id
        const {
            data: flatrateAndWeightCosts,
            error: flatrateAndWeightCostsError,
        } = await supabase
            .from('flatrate_and_weight_cost')
            .select('id')
            .eq('distribution_costs_id', distributionCostsId);

        if (flatrateAndWeightCostsError) {
            return NextResponse.json(
                { message: 'Error getting flatrate and weight costs' },
                { status: 500 },
            );
        }

        // Delete all previos flatrate and weight costs linked with the distribution_costs_id
        flatrateAndWeightCosts.map(async (flatrateAndWeightCost) => {
            const { error: deleteError } = await supabase
                .from('flatrate_and_weight_cost')
                .delete()
                .eq('id', flatrateAndWeightCost.id);
            if (deleteError) {
                return NextResponse.json(
                    { message: 'Error deleting flatrate and weight costs' },
                    { status: 500 },
                );
            }
        });

        return NextResponse.json(
            { message: 'Flatrate and weight costs deleted' },
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const distributionCostsId = formData.get('distribution_costs_id') as string;
    const flatrateWeightSize = parseInt(
        formData.get('flatrate_weight_size') as string,
    );
    const costExtraPerKG = parseFloat(
        formData.get('cost_extra_per_kg') as string,
    );

    let flatrateWeights = [];

    for (let i = 0; i < flatrateWeightSize; i++) {
        const weightFrom = parseFloat(
            formData.get(`flatrate_weight[${i}].weight_from`) as string,
        );
        const weightFo = parseFloat(
            formData.get(`flatrate_weight[${i}].weight_to`) as string,
        );
        const baseCost = parseFloat(
            formData.get(`flatrate_weight[${i}].base_cost`) as string,
        );

        flatrateWeights.push({
            weight_from: weightFrom,
            weight_to: weightFo,
            base_cost: baseCost,
        });
    }

    const supabase = await createServerClient();

    // Insert all the flatrate and weight costs linked with the distribution_costs_id
    flatrateWeights.map(async (flatrateWeight) => {
        const { error: flatrateAndWeightCostsError } = await supabase
            .from('flatrate_and_weight_cost')
            .insert({
                distribution_costs_id: distributionCostsId,
                weight_from: flatrateWeight.weight_from,
                weight_to: flatrateWeight.weight_to,
                base_cost: flatrateWeight.base_cost,
            });

        if (flatrateAndWeightCostsError) {
            return NextResponse.json(
                { message: 'Error creating flatrate and weight costs' },
                { status: 500 },
            );
        }
    });

    // Update costExtraPerKG in distribution_costs
    // TODO: ESTÁ MAL, Cost extra per kg no existe en distribution_cost, hay que hacer como en area_and_weight_cost -> Que se asigne en su tabla el coste extra.
    // const { error: distributionCostsError } = await supabase
    //     .from('distribution_costs')
    //     .update({
    //         cost_extra_per_kg: costExtraPerKG,
    //     })
    //     .eq('id', distributionCostsId);

    // if (distributionCostsError) {
    //     return NextResponse.json(
    //         { message: 'Error updating cost extra per kg' },
    //         { status: 500 },
    //     );
    // }

    return NextResponse.json(
        { message: 'Flatrate and weight costs created' },
        {
            status: 200,
        },
    );
}
