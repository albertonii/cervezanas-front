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

    if (order) {
        if (!order?.is_consumer_email_sent) {
            sendConsumerEmailNotification(order);
        }

        if (!order?.is_producer_email_sent) {
            sendProducerEmailNotification(order);
        }

        if (!order?.is_distributor_email_sent) {
            sendDistributorEmailNotification(order);
        }
    }

    if (!order) return <></>;

    return (
        <>
            {/* {order && (
                <SuccessCheckout
                    order={order}
                    isError={isError}
                    santanderResponse={santanderResponse}
                />
            )} */}
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
                business_orders!business_orders_order_id_fkey (
                    *,
                    order_items (
                        *,
                        product_packs (
                            *,
                            products (
                            *,
                            product_media (*)
                            )
                        )
                    ),
                    producer_user (*),
                    distributor_user (*),
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

async function sendConsumerEmailNotification(order: IOrder) {
    // Marcar como enviado
    const supabase = await createServerClient();

    const { error } = await supabase
        .from('orders')
        .update({ is_consumer_email_sent: true })
        .eq('id', order.id);

    if (error) {
        console.error(error);
        return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const consumerUrl = `${baseUrl}/api/emails/new_consumer_online_order`;

    const formData = new FormData();
    formData.set('email_to', order.users?.email as string);
    formData.set('subtotal_price', order.subtotal.toString() as string);
    formData.set('shipping_price', order.shipping.toString() as string);
    formData.set('total_price', order.total.toString() as string);
    formData.set('order_number', order.order_number as string);

    const numItems =
        order.business_orders![0].order_items?.length.toString() ?? '0';

    formData.set('order_items_count', numItems);

    order.business_orders?.[0].order_items?.forEach((item, index) => {
        formData.set(
            `order_items[${index}][product_id]`,
            item.product_packs?.products?.id as string,
        );
        formData.set(
            `order_items[${index}][name]`,
            item.product_packs?.products?.name as string,
        );
        formData.set(
            `order_items[${index}][price]`,
            item.product_packs?.price.toString() as string,
        );
        formData.set(
            `order_items[${index}][quantity]`,
            item.quantity.toString() as string,
        );
    });

    // Información de envío
    formData.set('shipping_name', order.shipping_name as string);
    formData.set('shipping_lastname', order.shipping_lastname as string);
    formData.set('shipping_document_id', order.shipping_document_id as string);
    formData.set('shipping_phone', order.shipping_phone as string);
    formData.set('shipping_address', order.shipping_address as string);
    formData.set(
        'shipping_address_extra',
        order.shipping_address_extra as string,
    );
    formData.set('shipping_city', order.shipping_city as string);
    formData.set('shipping_sub_region', order.shipping_sub_region as string);
    formData.set('shipping_region', order.shipping_region as string);
    formData.set('shipping_country', order.shipping_country as string);
    formData.set('shipping_postal_code', order.shipping_zipcode as string);

    // Información de facturación
    formData.set('billing_name', order.billing_name as string);
    formData.set('billing_lastname', order.billing_lastname as string);
    formData.set('billing_document_id', order.billing_document_id as string);
    formData.set('billing_phone', order.billing_phone as string);
    formData.set('billing_address', order.billing_address as string);
    formData.set('billing_city', order.billing_city as string);
    formData.set('billing_sub_region', order.billing_sub_region as string);
    formData.set('billing_region', order.billing_region as string);
    formData.set('billing_country', order.billing_country as string);
    formData.set('billing_postal_code', order.billing_zipcode as string);
    formData.set(
        'billing_is_company',
        order.billing_is_company ? 'true' : 'false',
    );

    // Email al usuario
    fetch(consumerUrl, {
        method: 'POST',
        body: formData,
    });
}

async function sendProducerEmailNotification(order: IOrder) {
    // Marcar como enviado
    const supabase = await createServerClient();

    const { error } = await supabase
        .from('orders')
        .update({ is_producer_email_sent: true })
        .eq('id', order.id);

    if (error) {
        console.error(error);
        return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const producerUrl = `${baseUrl}/api/emails/new_producer_online_order`;

    // Agrupar a los productores que participan en este pedido:
    const producers = order.business_orders?.map(
        (businessOrder) => businessOrder.producer_user,
    );

    producers?.map((producer) => {
        const formData = new FormData();

        formData.set('email_to', producer?.company_email as string);
        formData.set('subtotal_price', order.subtotal.toString() as string);
        formData.set('shipping_price', order.shipping.toString() as string);
        formData.set('total_price', order.total.toString() as string);
        formData.set('order_number', order.order_number as string);

        // agrupar los businessOrders donde el productor esté implicado
        const producerBusinessOrders = order.business_orders?.filter(
            (businessOrder) =>
                businessOrder.producer_user?.user_id === producer?.user_id,
        );

        if (!producerBusinessOrders) return;

        const numItems =
            producerBusinessOrders[0].order_items?.length.toString() ?? '0';

        formData.set('order_items_count', numItems);

        producerBusinessOrders[0].order_items?.forEach((item, index) => {
            formData.set(
                `order_items[${index}][product_id]`,
                item.product_packs?.products?.id as string,
            );
            formData.set(
                `order_items[${index}][name]`,
                item.product_packs?.products?.name as string,
            );
            formData.set(
                `order_items[${index}][price]`,
                item.product_packs?.price.toString() as string,
            );
            formData.set(
                `order_items[${index}][quantity]`,
                item.quantity.toString() as string,
            );
        });

        producerBusinessOrders.forEach((businessOrder, index) => {
            formData.set(
                `order_items[${index}][distributor_email]`,
                businessOrder?.distributor_user?.company_email as string,
            );
            formData.set(
                `order_items[${index}][distributor_phone]`,
                businessOrder.distributor_user?.company_phone as string,
            );
            formData.set(
                `order_items[${index}][distributor_name]`,
                businessOrder.distributor_user?.company_name as string,
            );
            formData.set(
                `order_items[${index}][distributor_id]`,
                businessOrder.distributor_user?.user_id as string,
            );
        });

        // Email al productor
        fetch(producerUrl, {
            method: 'POST',
            body: formData,
        });
    });
}

async function sendDistributorEmailNotification(order: IOrder) {
    // Marcar como enviado
    const supabase = await createServerClient();

    const { error } = await supabase
        .from('orders')
        .update({ is_distributor_email_sent: true })
        .eq('id', order.id);

    if (error) {
        console.error(error);
        return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const distributorUrl = `${baseUrl}/api/emails/new_distributor_online_order`;

    // Agrupar a los distribuidores que participan en este pedido:
    const distributors = order.business_orders?.map(
        (businessOrder) => businessOrder.distributor_user,
    );

    distributors?.map((distributor) => {
        const formData = new FormData();

        formData.set('email_to', distributor?.company_email as string);
        formData.set('subtotal_price', order.subtotal.toString() as string);
        formData.set('shipping_price', order.shipping.toString() as string);
        formData.set('total_price', order.total.toString() as string);
        formData.set('order_number', order.order_number as string);

        // Agrupar los businessOrders donde el distribuidor esté implicado
        const distributorBusinessOrders = order.business_orders?.filter(
            (businessOrder) =>
                businessOrder.distributor_user?.user_id ===
                distributor?.user_id,
        );

        if (!distributorBusinessOrders) return;

        const numItems =
            distributorBusinessOrders[0].order_items?.length.toString() ?? '0';

        formData.set('order_items_count', numItems);

        distributorBusinessOrders[0].order_items?.forEach((item, index) => {
            formData.set(
                `order_items[${index}][product_id]`,
                item.product_packs?.products?.id as string,
            );
            formData.set(
                `order_items[${index}][name]`,
                item.product_packs?.products?.name as string,
            );
            formData.set(
                `order_items[${index}][price]`,
                item.product_packs?.price.toString() as string,
            );
            formData.set(
                `order_items[${index}][quantity]`,
                item.quantity.toString() as string,
            );
        });

        distributorBusinessOrders.forEach((businessOrder, index) => {
            formData.set(
                `order_items[${index}][producer_email]`,
                businessOrder?.producer_user?.company_email as string,
            );
            formData.set(
                `order_items[${index}][producer_phone]`,
                businessOrder.producer_user?.company_phone as string,
            );
            formData.set(
                `order_items[${index}][producer_name]`,
                businessOrder.producer_user?.company_name as string,
            );
            formData.set(
                `order_items[${index}][producer_id]`,
                businessOrder.producer_user?.user_id as string,
            );
        });

        // Información de envío
        formData.set('shipping_name', order.shipping_name as string);
        formData.set('shipping_lastname', order.shipping_lastname as string);
        formData.set(
            'shipping_document_id',
            order.shipping_document_id as string,
        );
        formData.set('shipping_phone', order.shipping_phone as string);
        formData.set('shipping_address', order.shipping_address as string);
        formData.set(
            'shipping_address_extra',
            order.shipping_address_extra as string,
        );
        formData.set('shipping_city', order.shipping_city as string);
        formData.set(
            'shipping_sub_region',
            order.shipping_sub_region as string,
        );
        formData.set('shipping_region', order.shipping_region as string);
        formData.set('shipping_country', order.shipping_country as string);
        formData.set('shipping_postal_code', order.shipping_zipcode as string);

        // Email al distribuidor
        fetch(distributorUrl, {
            method: 'POST',
            body: formData,
        });
    });
}
