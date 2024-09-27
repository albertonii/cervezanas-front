import readUserSession from '@/lib/actions';
import SuccessCheckout from './SuccessCheckout';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { IOrder } from '@/lib/types/types';
import { decodeBase64 } from '@/utils/utils';

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
                business_orders!business_orders_order_id_fkey (
                    *,
                    producer_user!business_orders_producer_id_fkey (*,
                        users (
                            *,
                            name,
                            lastname,
                            email,
                            username,
                            avatar_url
                        )
                    ),
                    distributor_user!business_orders_distributor_id_fkey (*,
                        users (
                            *,
                            name,
                            lastname,
                            email,
                            username,
                            avatar_url
                        )
                    ),
                    order_items (
                        *,
                        product_packs (
                            *,
                            products (
                                *,
                                product_multimedia (*)
                            )
                        )
                    ),
                    shipment_tracking (
                        id,
                        created_at,
                        status,
                        order_id,
                        shipment_company,
                        shipment_url,
                        estimated_date,
                        shipment_tracking_id,
                        is_updated_by_distributor,
                        shipment_tracking_messages (
                            *
                        )
                    )
                ),
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

    return { orderData: orderData as IOrder, isError: false };
}
