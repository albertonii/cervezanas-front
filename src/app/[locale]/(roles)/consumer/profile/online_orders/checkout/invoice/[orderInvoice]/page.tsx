import OrderInvoice from './OrderInvoice';
import readUserSession from '@/lib/actions';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';

export default async function OrderInvoicePage({
    params,
}: {
    params: { slug: any };
}) {
    const { slug } = params;
    const orderData = await getInvoiceData(slug);
    const [order] = await Promise.all([orderData]);

    return <>{order ?? <OrderInvoice order={order} />}</>;
}

async function getInvoiceData(slug: any) {
    const { orderInvoice: orderId } = slug;

    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(
            `
        *,
        shipping_info(id, *),
        billing_info(id, *),
        products(
          id, 
          name, 
          price,
          product_multimedia (*),
          order_items (*)
        )
      `,
        )
        .eq('order_number', orderId)
        .single();

    if (orderError) {
        throw new Error(orderError.message);
    }

    if (!orderData) {
        return {
            order: null,
        };
    }

    return orderData;
}
