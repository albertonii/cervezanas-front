import createServerClient from '@/utils/supabaseServer';
import { ONLINE_ORDER_STATUS } from '@/constants';
import { sendPushNotification } from '@/lib//actions';
import { calculateInvoicePeriod } from '@/utils/utils';
import { NextRequest, NextResponse } from 'next/server';
import { IProductPackCartItem } from '@/lib/types/types';
import {
    ROUTE_BUSINESS_ORDERS,
    ROUTE_DISTRIBUTOR,
    ROUTE_ONLINE_ORDERS,
    ROUTE_PRODUCER,
    ROUTE_PROFILE,
} from '@/config';

export async function POST(request: NextRequest) {
    const supabase = await createServerClient();

    const formData = await request.formData();

    const user_id = formData.get('user_id') as string;
    const name = formData.get('name') as string;
    const lastname = formData.get('lastname') as string;
    const total = Number(formData.get('total'));
    const subtotal = Number(formData.get('subtotal'));
    const deliveryCost = Number(formData.get('delivery_cost'));
    const discount = Number(formData.get('discount'));
    const promoCode = formData.get('promo_code') as string;
    const currency = formData.get('currency') as string;
    const orderNumber = formData.get('order_number') as string;
    const type = formData.get('type') as string;
    // const tax = Number(formData.get('tax'));
    const items = JSON.parse(formData.get('items') as string);

    // Información envío
    const shippingName = formData.get('shipping_name') as string;
    const shippingLastname = formData.get('shipping_lastname') as string;
    const shippingDocumentId = formData.get('shipping_document_id') as string;
    const shippingPhone = formData.get('shipping_phone') as string;
    const shippingAddress = formData.get('shipping_address') as string;
    const shippingAddressExtra = formData.get(
        'shipping_address_extra',
    ) as string;
    const shippingCountry = formData.get('shipping_country') as string;
    const shippingRegion = formData.get('shipping_region') as string;
    const shippingSubRegion = formData.get('shipping_sub_region') as string;
    const shippingCity = formData.get('shipping_city') as string;
    const shippingZipcode = formData.get('shipping_zipcode') as string;

    // Información facturación
    const billingName = formData.get('billing_name') as string;
    const billingLastname = formData.get('billing_lastname') as string;
    const billingDocumentId = formData.get('billing_document_id') as string;
    const billingPhone = formData.get('billing_phone') as string;
    const billingAddress = formData.get('billing_address') as string;
    const billingCountry = formData.get('billing_country') as string;
    const billingRegion = formData.get('billing_region') as string;
    const billingSubRegion = formData.get('billing_sub_region') as string;
    const billingCity = formData.get('billing_city') as string;
    const billingZipcode = formData.get('billing_zipcode') as string;
    const billingIsCompany = formData.get('billing_is_company') === 'true';

    const createdOrderIds = [];

    let promoCodeData = null;

    try {
        if (promoCode !== null && promoCode !== '' && promoCode !== 'none') {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const url = `${baseUrl}/api/shopping_basket/promo_code`;

            // Validar código promocional
            const promoCodeResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: promoCode, user_id }),
            });

            if (!promoCodeResponse.ok) {
                return NextResponse.json(
                    { message: 'Invalid promo code' },
                    { status: 400 },
                );
            }

            /*
                id
                isValid
                discountType
                discountValue
                message
                code
            */
            promoCodeData = await promoCodeResponse.json();

            if (!promoCodeData || !promoCodeData.isValid) {
                return NextResponse.json(
                    { message: 'Invalid promo code' },
                    { status: 400 },
                );
            }
        }

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                owner_id: user_id,
                customer_name: `${name} ${lastname}`,
                status: ONLINE_ORDER_STATUS.PENDING,
                issue_date: new Date().toISOString(),
                estimated_date: new Date(
                    new Date().getTime() + 1000 * 60 * 60 * 24 * 3,
                ).toISOString(), // 3 days
                total: total,
                subtotal: subtotal,
                shipping: deliveryCost,
                discount: discount,
                promo_code: promoCode,
                currency: currency,
                order_number: orderNumber,
                type: type,
                // tax: tax,
                shipping_name: shippingName,
                shipping_lastname: shippingLastname,
                shipping_document_id: shippingDocumentId,
                shipping_phone: shippingPhone,
                shipping_address: shippingAddress,
                shipping_address_extra: shippingAddressExtra,
                shipping_country: shippingCountry,
                shipping_region: shippingRegion,
                shipping_sub_region: shippingSubRegion,
                shipping_city: shippingCity,
                shipping_zipcode: shippingZipcode,
                billing_name: billingName,
                billing_lastname: billingLastname,
                billing_document_id: billingDocumentId,
                billing_phone: billingPhone,
                billing_address: billingAddress,
                billing_country: billingCountry,
                billing_region: billingRegion,
                billing_sub_region: billingSubRegion,
                billing_city: billingCity,
                billing_zipcode: billingZipcode,
                billing_is_company: billingIsCompany,
            })
            .select('id')
            .single();

        if (!order || orderError) {
            return NextResponse.json(
                { message: 'Error creating online order' },
                { status: 500 },
            );
        }

        createdOrderIds.push(order.id);

        // Vamos a agrupar los items por distributor_id así podremos crear el tracking_id por distribuidores
        // De esta manera podremos enviar notificaciones a los distribuidores de los pedidos que les corresponden
        // Y estos podrán actualizar la información de tracking para que sea visible por el cliente

        // Agrupar todos aquellos productos que tengan el mismo ID de productor
        const itemsByDistributor = items.reduce(
            (acc: any, item: IProductPackCartItem) => {
                if (!acc[item.producer_id]) {
                    acc[item.producer_id] = [];
                }

                acc[item.producer_id].push(item);

                return acc;
            },
            {},
        );

        // Estoy recorriendo todos los elementos del carrito de la compra,
        // aquellos que tengan un pack, los inserto en la tabla order_items
        // además, como son del mismo pack y del mismo producto, los agrupo
        // y asigno el mismo identificador de pedido para el negocio - business_order_id
        for (const itemsGroup of Object.values(
            itemsByDistributor as { [key: string]: IProductPackCartItem[] },
        )) {
            // Creamos una entrada en shipment_tracking para que lo compartan entre los demás business_orders para un mismo distribuidor
            const { data: shipmentTracking, error: shipmentTrackingError } =
                await supabase
                    .from('shipment_tracking')
                    .insert({
                        order_id: order.id,
                        status: ONLINE_ORDER_STATUS.PENDING,
                        estimated_date: new Date(
                            new Date().getTime() + 1000 * 60 * 60 * 24 * 7,
                        ).toISOString(), // 7 days,
                    })
                    .select('id')
                    .single();

            if (!shipmentTracking || shipmentTrackingError) {
                return NextResponse.json(
                    { message: 'Error creating shipment tracking' },
                    { status: 500 },
                );
            }

            for (const product of itemsGroup) {
                await Promise.all(
                    product.packs.map(async (pack) => {
                        const distributorId = product.distributor_id;
                        const producerId = product.producer_id;

                        if (!distributorId) {
                            return NextResponse.json(
                                {
                                    message:
                                        'Distributor ID not found for the item order',
                                },
                                { status: 500 },
                            );
                        }

                        if (!producerId) {
                            return NextResponse.json(
                                {
                                    message:
                                        'Producer ID not found for the item order',
                                },
                                { status: 500 },
                            );
                        }

                        const {
                            data: businessOrder,
                            error: businessOrderError,
                        } = await supabase
                            .from('business_orders')
                            .insert({
                                order_id: order.id,
                                producer_id: producerId,
                                distributor_id: distributorId,
                                tracking_id: shipmentTracking.id,
                                total_sales: pack.price * pack.quantity,
                                platform_comission_producer: 0.15,
                                platform_comission_distributor: 0.05,
                                net_revenue_producer:
                                    pack.price * pack.quantity * 0.85,
                                // net_revenue_distributor: order.shipment_price * 0.95,
                                net_revenue_distributor: 0,
                                invoice_period: calculateInvoicePeriod(
                                    new Date(),
                                ),
                            })
                            .select('id')
                            .single();

                        if (businessOrderError) {
                            const { error: cancelOrderStatusError } =
                                await supabase.from('orders').update({
                                    status: ONLINE_ORDER_STATUS.ERROR,
                                });

                            if (cancelOrderStatusError) {
                                return NextResponse.json(
                                    {
                                        message:
                                            'Error updating order status to CANCEL',
                                    },
                                    { status: 500 },
                                );
                            }

                            return NextResponse.json(
                                {
                                    message:
                                        'Error inserting new business_order',
                                },
                                { status: 500 },
                            );
                        }

                        const { data, error: orderItemError } = await supabase
                            .from('order_items')
                            .insert({
                                business_order_id: businessOrder.id,
                                product_pack_id: pack.id,
                                quantity: pack.quantity,
                                product_name: product.name,
                                product_pack_name: pack.name,
                                product_price: pack.price,
                                subtotal: pack.price * pack.quantity,
                                is_reviewed: false,
                            })
                            .select('product_pack_id')
                            .single();

                        if (orderItemError) {
                            return NextResponse.json(
                                { message: 'Error inserting new order_item' },
                                { status: 500 },
                            );
                        }

                        // Notification to distributor
                        const distributorMessage = `Tienes un nuevo pedido online de ${name} ${lastname} con número de pedido ${orderNumber} y con identificador de negocio ${businessOrder.id}`;
                        const distributorLink = `${ROUTE_DISTRIBUTOR}${ROUTE_PROFILE}${ROUTE_BUSINESS_ORDERS}`;

                        sendPushNotification(
                            distributorId,
                            distributorMessage,
                            distributorLink,
                        );

                        // Notification to producer
                        const producerMessage = `Tienes un nuevo pedido online de ${name} ${lastname} con número de pedido ${orderNumber} y con identificador de negocio ${businessOrder.id}`;
                        const producerLink = `${ROUTE_PRODUCER}${ROUTE_PROFILE}${ROUTE_ONLINE_ORDERS}`;

                        sendPushNotification(
                            producerId,
                            producerMessage,
                            producerLink,
                        );
                    }),
                );
            }
        }

        return NextResponse.json({ message: order.id }, { status: 201 });
    } catch (error) {
        // Rollback
        if (createdOrderIds.length > 0) {
            await supabase.from('orders').delete().in('id', createdOrderIds);
        }

        return NextResponse.json(
            { message: 'Error creating online order' },
            { status: 500 },
        );
    }
}
