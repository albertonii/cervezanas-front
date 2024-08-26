import OrderInvoice from './OrderInvoice';
import readUserSession from '@/lib/actions';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { IBusinessOrder } from '@/lib/types/types';

export default async function OrderInvoicePage({
    params,
}: {
    params: { orderInvoice: any };
}) {
    const { orderInvoice } = params;

    const bOrderData = await getInvoiceData(orderInvoice);
    const [bOrders] = await Promise.all([bOrderData]);

    if (!bOrders) {
        return <div>Order not found</div>;
    }

    return <OrderInvoice bOrders={bOrders} />;
}

async function getInvoiceData(orderId: string) {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data: bOrderData, error: bOrderError } = await supabase
        .from('business_orders')
        .select(
            `
                *,
                orders (*),
                order_items (
                    *,
                    product_packs (*)
                )
                
            `,
        )
        .eq('orders.order_number', orderId)
        .not('orders', 'is', null);

    if (bOrderError) {
        console.info('Error getting order data', bOrderError);
        throw new Error(bOrderError.message);
    }

    if (!bOrderData) {
        return [];
    }

    return bOrderData as IBusinessOrder[];
}
