import readUserSession from '@/lib/actions';
import CoverageLayout from './CoverageLayout';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { IDistributionCost } from '@/lib/types/types';

export default async function OrdersPage() {
    const distributionCosts = await getDistributionCosts();

    return <CoverageLayout distributionCosts={distributionCosts} />;
}

async function getDistributionCosts() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    // Select only the orders where business orders have the distributor_id associated to session user id
    const { data, error } = await supabase
        .from('distribution_costs')
        .select(
            `
                distribution_costs_in_product
            `,
        )
        .eq('distributor_id', [session.id])
        .single();

    if (error) throw error;

    return data as IDistributionCost;
}
