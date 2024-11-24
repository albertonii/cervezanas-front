import createServerClient from '@/utils/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
    const formData = await request.formData();

    const distributionCostsId = formData.get('distribution_costs_id') as string;
    const distributionCostsInProduct = formData.get(
        'distribution_costs_in_product',
    ) as string;

    const distributionCostsInProductBoolean =
        distributionCostsInProduct === 'true';

    const supabase = await createServerClient();

    // Update costExtraPerKG in distribution_costs
    const { error: distributionCostsError } = await supabase
        .from('distribution_costs')
        .update({
            distribution_costs_in_product: distributionCostsInProductBoolean,
        })
        .eq('id', distributionCostsId);

    if (distributionCostsError) {
        return NextResponse.json(
            { message: 'Error updating distribution costs' },
            { status: 500 },
        );
    }

    return NextResponse.json(
        {
            message: 'Distribution costs updated successfully',
        },
        {
            status: 200,
        },
    );
}
