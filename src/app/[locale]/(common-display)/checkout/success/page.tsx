import readUserSession from '@/lib//actions';
import SuccessCheckout from './SuccessCheckout';
import createServerClient from '@/utils/supabaseServer';
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
    const { orderData, isError, santanderResponseData } = await getSuccessData(
        searchParams,
    );
    const [order, santanderResponse] = await Promise.all([
        orderData,
        santanderResponseData,
    ]);
    if (!order) return <></>;

    return (
        <>
            {order && (
                <SuccessCheckout
                    order={order}
                    isError={isError}
                    santanderResponse={santanderResponse}
                />
            )}
        </>
    );
}

async function getSuccessData(searchParams: any) {
    const { Ds_MerchantParameters } = searchParams as {
        Ds_MerchantParameters: string;
        Ds_SignatureVersion: string;
        Ds_Signature: string;
    };

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
        Ds_Order: orderNumber,
        Ds_Date,
        Ds_Hour,
        Ds_Amount,
        Ds_Terminal,
        Ds_Response,
        Ds_MerchantData,
        Ds_SecurePayment,
        Ds_TransactionType,
        Ds_Card_Country,
        Ds_AuthorisationCode,
        Ds_ConsumerLanguage,
        Ds_Card_Brand,
    } = JSON.parse(decodeBase64(Ds_MerchantParameters));

    console.log('Hora', Ds_Hour);
    console.log('Fecha', Ds_Date);
    console.log('Cantidad', Ds_Amount);
    console.log('Terminal', Ds_Terminal);
    console.log('Respuesta', Ds_Response);
    console.log('Tipo Dato', Ds_MerchantData);
    console.log('Pago Seguro', Ds_SecurePayment);
    console.log('Tipo transacción', Ds_TransactionType);
    console.log('Código País Tarjeta', Ds_Card_Country);
    console.log('Código Auth', Ds_AuthorisationCode);
    console.log('Idioma', Ds_ConsumerLanguage);
    console.log('Marca Tarjeta', Ds_Card_Brand);

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
            santanderResponseData: null,
        };
    }

    if (!orderData) {
        return {
            orderData: null,
            isError: true,
            santanderResponseData: null,
        };
    }

    return {
        orderData: orderData as IOrder,
        isError: false,
        santanderResponseData: Ds_Response,
    };
}
