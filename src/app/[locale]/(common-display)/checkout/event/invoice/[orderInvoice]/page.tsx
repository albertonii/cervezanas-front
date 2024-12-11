import EventOrderInvoice from './EventOrderInvoice';
import createServerClient from '@/utils/supabaseServer';
import { IEventOrder } from '@/lib/types/eventOrders';

export default async function OrderInvoicePage({
    params,
}: {
    params: { locale: string; orderInvoice: string };
}) {
    const { orderInvoice } = params;
    const order = await getInvoiceData(orderInvoice);

    // Verifica si `order` existe antes de renderizar `EventOrderInvoice`
    return <>{order && <EventOrderInvoice order={order} />}</>;
}

async function getInvoiceData(
    orderInvoice: string,
): Promise<IEventOrder | null> {
    const supabase = await createServerClient();

    const { data: orderData, error: orderError } = await supabase
        .from('event_orders')
        .select(
            `
                *,
                events (*),
                event_order_cps (
                    *,
                    cp_events (cp_name),
                    event_order_items (
                        *,
                        product_packs (
                            *
                        )
                    )
                )
            `,
        )
        .eq('order_number', orderInvoice)
        .single();

    if (orderError) {
        throw new Error(orderError.message);
    }

    return orderData as IEventOrder | null;
}
