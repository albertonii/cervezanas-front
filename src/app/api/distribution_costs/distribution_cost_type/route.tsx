import { NextRequest, NextResponse } from 'next/server';
import createServerClient from '@/utils/supabaseServer';

export async function PUT(request: NextRequest) {
    const formData = await request.formData();

    const distributionCostsId = formData.get('distribution_costs_id') as string;
    const distributionCostType = formData.get(
        'distribution_cost_type',
    ) as string;

    const supabase = await createServerClient();

    // Update the distribution cost type
    const { error: updateDistributionCostTypeError } = await supabase
        .from('distribution_costs')
        .update({ selected_method: distributionCostType })
        .eq('id', distributionCostsId);

    if (updateDistributionCostTypeError) {
        return NextResponse.json(
            { message: 'Error updating the distribution cost type' },
            { status: 500 },
        );
    }

    return NextResponse.json(
        { message: 'Distribution cost type updated' },
        { status: 201 },
    );
}
