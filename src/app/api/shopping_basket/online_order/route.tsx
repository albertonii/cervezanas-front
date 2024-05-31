import { NextRequest, NextResponse } from 'next/server';
import {
    ROUTE_BUSINESS_ORDERS,
    ROUTE_DISTRIBUTOR,
    ROUTE_ONLINE_ORDERS,
    ROUTE_PRODUCER,
    ROUTE_PROFILE,
} from '../../../../config';
import { ONLINE_ORDER_STATUS } from '../../../../constants';
import { sendPushNotification } from '../../../../lib/actions';
import { IProductPackCartItem } from '../../../../lib/types/types';
import createServerClient from '../../../../utils/supabaseServer';

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
    const discountCode = formData.get('discount_code') as string;
    const currency = formData.get('currency') as string;
    const orderNumber = formData.get('order_number') as string;
    const type = formData.get('type') as string;
    const tax = Number(formData.get('tax'));
    const shippingInfoId = formData.get('shipping_info_id') as string;
    const billingInfoId = formData.get('billing_info_id') as string;
    const items = JSON.parse(formData.get('items') as string);

    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            owner_id: user_id,
            customer_name: `${name} ${lastname}`,
            status: ONLINE_ORDER_STATUS.PENDING,
            tracking_id: '123456789',
            issue_date: new Date().toISOString(),
            estimated_date: new Date(
                new Date().getTime() + 1000 * 60 * 60 * 24 * 3,
            ).toISOString(), // 3 days
            total: total,
            subtotal: subtotal,
            shipping: deliveryCost,
            discount: discount,
            discount_code: discountCode,
            currency: currency,
            order_number: orderNumber,
            type: type,
            tax: tax,
            shipping_info_id: shippingInfoId,
            billing_info_id: billingInfoId,
        })
        .select('id')
        .single();

    if (orderError) {
        return NextResponse.json(
            { message: 'Error creating online order' },
            { status: 500 },
        );
    }

    // Estoy recorriendo todos los elementos del carrito de la compra,
    // aquellos que tengan un pack, los inserto en la tabla order_items
    // además, como son del mismo pack y del mismo producto, los agrupo
    // y asigno el mismo identificador de pedido para el negocio - business_order_id
    items.map((item: IProductPackCartItem) => {
        item.packs.map(async (pack) => {
            // HAY UN ERROR EN PACKS -> Si nos fijamos en el valor de pack.id es el mismo que product_id -> Hay que buscar la causa de esto

            console.log(pack);
            const distributorId = item.distributor_id;
            const producerId = item.producer_id;

            const { data: businessOrder, error: businessOrderError } =
                await supabase
                    .from('business_orders')
                    .insert({
                        order_id: order.id,
                        producer_id: producerId,
                        distributor_id: distributorId,
                    })
                    .select('id')
                    .single();

            if (businessOrderError) throw businessOrderError;

            const { error: orderItemError } = await supabase
                .from('order_items')
                .insert({
                    business_order_id: businessOrder.id,
                    product_pack_id: pack.id,
                    quantity: pack.quantity,
                    is_reviewed: false,
                });

            pack.products?.owner_id;

            if (orderItemError) throw orderItemError;

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

            sendPushNotification(producerId, producerMessage, producerLink);
        });
    });

    return NextResponse.json({ message: order.id }, { status: 201 });
}
