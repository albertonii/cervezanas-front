import ErrorCheckout from './ErrorCheckout';
import React from 'react';
import { redirect } from 'next/navigation';
import { IOrder } from '@/lib/types/types';
import { decodeBase64 } from '@/utils/utils';
import createServerClient from '@/utils/supabaseServer';
import readUserSession from '@/lib/actions';

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
                default: 'Error page for checkout',
                template: `%s | Cervezanas`,
            },
            description:
                'Error page for checkout reached by code sent from Checkout Order',
        };
    } catch (error) {
        return {
            title: 'Not found',
            description: 'The page you are looking for does not exists',
        };
    }
}

export default async function Error({ searchParams }: any) {
    const { orderData, isError } = await getCheckoutErrorData(searchParams);
    const [order] = await Promise.all([orderData]);
    if (!order) return <></>;
    return (
        <>
            <ErrorCheckout order={order} isError={isError} />
        </>
    );
}

async function getCheckoutErrorData(searchParams: any) {
    const { Ds_MerchantParameters } = searchParams as {
        Ds_MerchantParameters: string;
        Ds_SignatureVersion: string;
        Ds_Signature: string;
    };

    const { Ds_Order: orderId, Ds_Response } = JSON.parse(
        decodeBase64(Ds_MerchantParameters),
    );

    const supabase = await createServerClient();

    // Check if we have a session
    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    if (Ds_Response === '9915') {
        // Update order status to user_cancelled
        const { error: statusError } = await supabase
            .from('orders')
            .update({ status: 'user_cancelled' })
            .eq('order_number', orderId);

        if (statusError) {
            console.error(statusError.message);
        }
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
                    product_packs (*)
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
        .eq('order_number', orderId)
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
