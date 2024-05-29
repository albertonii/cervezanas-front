import createServerClient from '../../../../../../utils/supabaseServer';
import readUserSession from '../../../../../../lib/actions';
import { IBusinessOrder } from '../../../../../../lib/types/types';
import { redirect } from 'next/navigation';
import { Orders } from './Orders';

export default async function OrdersPage() {
    const bOrdersData = await getBusinessOrdersData();
    const [bOrders] = await Promise.all([bOrdersData]);
    return (
        <>
            <Orders bOrders={bOrders} />
        </>
    );
}

async function getBusinessOrdersData() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    // Select only the orders where business orders have the distributor_id associated to session user id
    // const { data, error } = await supabase
    //     .from('orders')
    //     .select(
    //         `
    //             *,
    //             business_orders (
    //                 *
    //             )
    //         `,
    //     )
    //     .eq('business_orders.producer_id', [session.id])
    //     .order('created_at', { ascending: false });

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
        .eq('producer_id', [session.id])
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data as IBusinessOrder[];
}
