import readUserSession from '@/lib//actions';
import SuccessCheckout from './SuccessCheckout';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { decodeBase64 } from '@/utils/utils';
import { IEventOrder } from '@/lib/types/eventOrders';
import { headers } from 'next/headers';

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
    const headersList = headers();

    const domain = headersList.get('host'); // to get domain

    if (!domain) {
        return <></>;
    }

    const { orderData, isError, santanderResponseData } = await getSuccessData(
        searchParams,
    );

    const [order, santanderResponse] = await Promise.all([
        orderData,
        santanderResponseData,
    ]);

    return (
        <>
            {order && (
                <SuccessCheckout
                    order={order}
                    isError={isError}
                    santanderResponse={santanderResponse}
                    domain={domain}
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

    const logData = {
        Hora: Ds_Hour,
        Fecha: Ds_Date,
        Cantidad: Ds_Amount,
        Terminal: Ds_Terminal,
        Respuesta: Ds_Response,
        'Tipo Dato': Ds_MerchantData,
        'Pago Seguro': Ds_SecurePayment,
        'Tipo transacción': Ds_TransactionType,
        'Código País Tarjeta': Ds_Card_Country,
        'Código Auth': Ds_AuthorisationCode,
        Idioma: Ds_ConsumerLanguage,
        'Marca Tarjeta': Ds_Card_Brand,
    };

    // console.log('=== Datos de la Transacción ===');
    // Object.entries(logData).forEach(([key, value]) => {
    //     console.log(`${key}: ${value}`);
    // });
    // console.log('==============================');

    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

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
        orderData: orderData as IEventOrder,
        isError: false,
        santanderResponseData: Ds_Response,
    };
}
