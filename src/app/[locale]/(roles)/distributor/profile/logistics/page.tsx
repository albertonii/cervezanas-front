import CoverageLayout from './CoverageLayout';
import readUserSession from '../../../../../../lib/actions';
import createServerClient from '../../../../../../utils/supabaseServer';
import { redirect } from 'next/navigation';
import { IDistributionCost } from '../../../../../../lib/types/types';

export default async function OrdersPage() {
    const distributionCosts = await getDistributionCost();

    return <CoverageLayout distributionCosts={distributionCosts} />;
}

async function getDistributionCost() {
    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const supabase = await createServerClient();

    const { data: distributionCosts, error: distributionCostsError } =
        await supabase
            .from('distribution_costs')
            .select(
                `
          id,
          created_at,
          distributor_id,
          flatrate_cost!flatrate_cost_distribution_costs_id_fkey (
            created_at,
            distribution_costs_id,
            local_distribution_cost,
            national_distribution_cost,
            europe_distribution_cost,
            international_distribution_cost,
            is_checked_local,
            is_checked_national,
            is_checked_europe,
            is_checked_international
          )
        `,
            )
            .eq('distributor_id', session.id)
            .single();

    if (distributionCostsError) {
        console.error(distributionCostsError);
        throw distributionCostsError;
    }

    return distributionCosts as IDistributionCost;
}
