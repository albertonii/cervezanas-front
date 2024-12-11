import createServerClient from '@/utils/supabaseServer';
import SuccessCheckoutInSitePayment from './SuccessCheckoutInSitePayment';
import { headers } from 'next/headers';
import { IEventOrder } from '@/lib/types/eventOrders';

export async function generateMetadata({ searchParams }: any) {
    try {
        const { order_number } = searchParams;

        if (!order_number) {
            return {
                title: 'Not found',
                description: 'The page you are looking for does not exists',
            };
        }

        return {
            title: {
                default: 'Pedido completado | Cervezanas',
                template: `%s | Cervezanas`,
            },
            description: 'Checkout order information displaying in this page',
        };
    } catch (error) {
        return {
            title: 'Not found',
            description: 'The page you are looking for does not exists',
        };
    }
}

export default async function SuccessPage({ searchParams }: any) {
    const headersList = headers();

    const domain = headersList.get('host'); // to get domain

    if (!domain) {
        return <></>;
    }

    const { orderData, isError } = await getSuccessData(searchParams);

    const [order] = await Promise.all([orderData]);

    return (
        <>
            {order && (
                <SuccessCheckoutInSitePayment
                    order={order}
                    isError={isError}
                    domain={domain}
                />
            )}
        </>
    );
}

async function getSuccessData(searchParams: any) {
    const { order_number: orderNumber } = searchParams;

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
