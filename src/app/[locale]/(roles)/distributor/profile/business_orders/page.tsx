import readUserSession from '@/lib//actions';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { BusinessOrders } from './BusinessOrders';
import { IBusinessOrder } from '@/lib//types/types';

export default async function BusinessOrdersPage() {
    const bOrdersData = await getBusinessOrdersData();
    const [bOrders] = await Promise.all([bOrdersData]);

    return (
        <>
            <BusinessOrders bOrders={bOrders} />
        </>
    );
}

async function getBusinessOrdersData() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data, error } = await supabase
        .from('business_orders')
        .select(
            `
                *, 
                orders (
                    *
                )
            `,
        )
        .eq('distributor_id', [session.id])
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data as IBusinessOrder[];
}
