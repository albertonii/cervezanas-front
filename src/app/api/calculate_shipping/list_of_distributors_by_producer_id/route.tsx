import { NextRequest, NextResponse } from 'next/server';
import { DistributionStatus } from '../../../../lib/enums';
import { createBrowserClient } from '../../../../utils/supabaseBrowser';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const producerId = searchParams.get('producer_id');

    if (!producerId) {
        return NextResponse.json(
            { message: 'Missing producer id' },
            { status: 400 },
        );
    }

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

    if (error) {
        return NextResponse.json(
            { message: 'Error fetching producer-distributor contracts' },
            { status: 500 },
        );
    }

    return NextResponse.json(contracts);
}
