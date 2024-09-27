import readUserSession from '@/lib//actions';
import SuccessCheckout from './SuccessCheckout';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { IOrder } from '@/lib//types/types';

export async function generateMetadata({
    searchParams,
}: {
    searchParams: { order_number: string };
}) {
    const orderNumber = searchParams.order_number;

    if (!orderNumber) {
        return {
            title: 'Not found',
            description: 'The page you are looking for does not exist',
        };
    }

    return {
        title: `Pedido completado | Cervezanas`,
        description: 'Checkout order information displaying in this page',
    };
}

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: { order_number?: string };
}) {
    const orderNumber = searchParams.order_number;
    if (!orderNumber) {
        return <></>;
    }

    const { orderData, isError } = await getSuccessData(orderNumber);
    const [order] = await Promise.all([orderData]);

    if (!order) return <></>;

    return <>{order && <SuccessCheckout order={order} isError={isError} />}</>;
}

async function getSuccessData(orderNumber: string) {
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
                business_orders!business_orders_order_id_fkey (
                    *,
                    order_items (
                        *,
                        product_packs (
                            *,
                            products (
                                *,
                                product_multimedia (*)
                            )
                        )
                    )
                ),
                users (*),
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
        orderData: orderData as IOrder,
        isError: false,
    };
}
