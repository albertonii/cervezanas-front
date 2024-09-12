import ErrorCheckout from './ErrorCheckout';
import readUserSession from '@/lib//actions';
import ErrorComponent from './ErrorComponent';
import createServerClient from '@/utils/supabaseServer';
import React from 'react';
import { redirect } from 'next/navigation';
import { IOrder } from '@/lib//types/types';
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

    if (isError) {
        return <ErrorComponent />;
    }

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

    if (!Ds_MerchantParameters) {
        return {
            orderData: null,
            isError: true,
        };
    }

    //     Ds_Date,
    //     Ds_Hour,
    //     Ds_Amount,
    //     Ds_Terminal,
    //     Ds_Response,
    //     Ds_MerchantData,
    //     Ds_SecurePayment,
    //     Ds_TransactionType,
    //     Ds_Card_Country,
    //     Ds_AuthorisationCode,
    //     Ds_ConsumerLanguage,
    //     Ds_Card_Type,
    //     Ds_Card_Brand,
    //     Ds_Card_Number,
    //     Ds_Expirydate,
    //     Ds_Merchant_Identifier,
    //     Ds_ErrorCode,
    //     ErrorCode,
    //     Codigo,
    //     Ds_UrlPago2Fases,
    const {
        Ds_Order: orderId,
        Ds_Response,
        Ds_ErrorCode,
    } = JSON.parse(decodeBase64(Ds_MerchantParameters));

    const supabase = await createServerClient();

    // Check if we have a session
    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    console.info('RESPONSE CODE FROM PAYMENT SERVICE:', Ds_Response);

    // Código de error Paypal - 9299 9300 9301 9700
    // Código de error Bizum - 9672 9673 9674 9675 9676 9677 9966
    // Tarjeta caducada - 101
    // Cancelado por el usuario - 9915, 9928

    if (
        Ds_Response === '9299' ||
        Ds_Response === '9300' ||
        Ds_Response === '9301' ||
        Ds_Response === '9700' ||
        Ds_Response === '9672' ||
        Ds_Response === '9673' ||
        Ds_Response === '9674' ||
        Ds_Response === '9675' ||
        Ds_Response === '9676' ||
        Ds_Response === '9677' ||
        Ds_Response === '9966' ||
        Ds_Response === '101' ||
        Ds_Response === '9915' ||
        Ds_Response === '9928'
    ) {
        // Update order status to user_cancelled
        const { error: statusError } = await supabase
            .from('orders')
            .update({ status: 'user_cancelled' })
            .eq('order_number', orderId);

        if (statusError) {
            console.error(statusError.message);
        }
    }

    // Cancelado por el titular - 9929, 915
    if (Ds_Response === '9929' || Ds_Response === '915') {
        const { error: statusError } = await supabase
            .from('orders')
            .update({ status: 'owner_cancelled' })
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
            billing_is_company,
            business_orders!business_orders_order_id_fkey (
                *,
                order_items (
                    *,
                    product_packs (
                        id,
                        product_id,
                        created_at,
                        quantity,
                        price,
                        img_url,
                        name,
                        randomUUID,
                        products (*)
                    )
                )
            )
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
