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
            promo_code,
            order_number,
            is_consumer_email_sent,
            is_producer_email_sent,
            is_distributor_email_sent,
            shipping_name,
            shipping_lastname,
            shipping_document_id,
            shipping_phone,
            shipping_address,
            shipping_address_extra,
            shipping_country,
            shipping_region,
            shipping_sub_region,
            shipping_city,
            shipping_zipcode,
            billing_name,
            billing_lastname,
            billing_document_id,
            billing_phone,
            billing_address,
            billing_country,
            billing_region,
            billing_sub_region,
            billing_city,
            billing_zipcode,
            billing_is_company
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
