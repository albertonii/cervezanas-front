import GuestOrderLookup from './GuestOrderLookup';
import createServerClient from '@/utils/supabaseServer';
import { IEventOrder } from '@/lib/types/eventOrders';

export default async function SuccessPage({ searchParams }: any) {
    const { order_number, guest_email } = searchParams as {
        order_number: string;
        guest_email: string;
    };

    console.log('SEARCH PARAMS', searchParams);

    if (!order_number || !guest_email) {
        return <div>Error: Missing order number or guest email.</div>;
    }

    const { orderData, isError } = await getLookupData(
        order_number,
        guest_email,
    );

    if (isError) {
        return <div>Error: Unable to fetch order data.</div>;
    }

    return <GuestOrderLookup order={orderData} />;
}

async function getLookupData(orderNumber: string, guestEmail: string) {
    const supabase = await createServerClient();

    const { data: orderData, error: orderError } = await supabase
        .from('event_orders')
        .select(
            `
                id, 
                created_at,
                updated_at,
                customer_id,
                event_id,
                status,
                total,
                subtotal,
                currency,
                discount,
                discount_code,
                order_number,
                tax,
                event_order_cps (
                    id,
                    created_at,
                    event_order_id,
                    cp_id,
                    order_number,
                    status,
                    notes,
                    event_order_items (
                        id,
                        created_at,
                        event_order_cp_id,
                        quantity,
                        status,
                        is_reviewed,
                        quantity_served,
                        product_pack_id,
                        product_packs (
                            *,
                            products (
                                name,
                                description
                            )
                        ),
                        event_order_cps (
                            *,
                            cp_events (
                                *,
                                cp (
                                    cp_name,
                                    address
                                )
                            )
                        )
                    )
                )
            `,
        )
        .eq('order_number', orderNumber)
        .single();

    console.log('ORDER DATA', orderData);
    console.log('ERROR', orderError);

    if (orderError) {
        console.error(orderError.message);
        return {
            orderData: null,
            isError: true,
        };
    }

    if (!orderData) {
        return {
            orderData: null,
            isError: true,
        };
    }

    return {
        orderData: orderData as IEventOrder,
        isError: false,
    };
}
