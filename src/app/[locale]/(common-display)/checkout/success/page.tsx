import SuccessCheckout from './SuccessCheckout';
import { redirect } from 'next/navigation';
import { decodeBase64 } from '@/utils/utils';
import createServerClient from '@/utils/supabaseServer';
import readUserSession from '@/lib//actions';
import { IOrder } from '@/lib//types/types';

export async function generateMetadata({ searchParams }: any) {
    try {
        const { Ds_MerchantParameters } = searchParams as {
            Ds_MerchantParameters: string;
            Ds_SignatureVersion: string;
            Ds_Signature: string;
        };

        if (!Ds_MerchantParameters) {
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
    const { orderData, isError } = await getSuccessData(searchParams);
    const [order] = await Promise.all([orderData]);
    if (!order) return <></>;

    return <>{order && <SuccessCheckout order={order} isError={isError} />}</>;
}

async function getSuccessData(searchParams: any) {
    const { Ds_MerchantParameters } = searchParams as {
        Ds_MerchantParameters: string;
        Ds_SignatureVersion: string;
        Ds_Signature: string;
    };

    const { Ds_Order: orderNumber } = JSON.parse(
        decodeBase64(Ds_MerchantParameters),
    );

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
                shipping_info (id, *),
                billing_info (id, *),
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

    return { orderData: orderData as IOrder, isError: false };
}
