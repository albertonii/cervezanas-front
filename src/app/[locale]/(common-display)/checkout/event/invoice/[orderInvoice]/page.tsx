import OrderInvoice from './OrderInvoice';
import { redirect } from 'next/navigation';
import createServerClient from '@/utils/supabaseServer';
import readUserSession from '@/lib/actions';
import { IOrder } from '@/lib/types/types';
import { VIEWS } from '@/constants';

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

    // Check if we have a session
    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(
            `
        id,
        created_at,
        updated_at,
        owner_id,
        status,
        customer_name, 
        tracking_id,
        issue_date,
        estimated_date,
        total,
        subtotal,
        shipping,
        tax,
        currency,
        discount,
        discount_code,
        order_number,
        shipping_info_id,
        billing_info_id,
        shipping_info!orders_shipping_info_id_fkey (
          *
        ),
        billing_info!orders_billing_info_id_fkey (
          id,
          created_at,
          updated_at,
          owner_id,
          name,
          lastname,
          document_id,
          phone,
          address,
          country,
          region,
          sub_region,
          city,
          zipcode,
          is_default,
          is_company
        ),
        business_orders!business_orders_order_id_fkey (*),
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

    return orderData as IOrder;
}
