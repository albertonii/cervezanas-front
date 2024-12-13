import createServerClient from '@/utils/supabaseServer';
import { generateOrderNumber, parseLocale } from '@/utils/utils';
import { NextRequest, NextResponse } from 'next/server';
import { IEventOrderItem } from '@/lib/types/eventOrders';
import { IProductPackEventCartItem } from '@/lib/types/types';
import {
    EVENT_ORDER_STATUS,
    EVENT_ORDER_CPS_STATUS,
    EVENT_ORDER_ITEM_STATUS,
} from '@/constants';

export async function POST(request: NextRequest) {
    const supabase = await createServerClient();

    // Obtener el locale correctamente
    const acceptLanguage = request.headers.get('accept-language');
    const locale = parseLocale(acceptLanguage); // Utiliza la función parseLocale

    const body = await request.json();

    const {
        userId,
        eventId,
        total,
        subtotal,
        discount,
        tax,
        currency,
        orderNumber,
        paymentMethod, // 'online' | 'on-site'
        cartItems, // Array<IProductPackEventCartItem>
        guestEmail,
    } = body;

    if (
        !eventId ||
        !total ||
        !subtotal ||
        !currency ||
        !orderNumber ||
        !paymentMethod ||
        !cartItems ||
        (!userId && !guestEmail)
    ) {
        return NextResponse.json(
            { message: 'Missing required fields' },
            { status: 400 },
        );
    }

    try {
        if (guestEmail) {
            // Validar el formato del correo electrónico
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(guestEmail)) {
                return NextResponse.json(
                    { message: 'Invalid guest email format' },
                    { status: 400 },
                );
            }

            // Obtener el nombre del evento para el correo
            const { data: eventData, error: eventError } = await supabase
                .from('events')
                .select('name')
                .eq('id', eventId)
                .single();

            if (eventError || !eventData) {
                return NextResponse.json(
                    { message: 'Event not found' },
                    { status: 404 },
                );
            }

            const eventName = eventData.name;

            // Enviar correo electrónico al invitado
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const guestUserUrl = `${baseUrl}/api/emails/event_order_as_guest`;

            // Asegurarse de que cada item tenga la URL del producto
            const enrichedCartItems = await Promise.all(
                cartItems.map(async (item: IProductPackEventCartItem) => {
                    return {
                        product_id: item.packs[0].id,
                        product_name: item.name,
                        pack_name: item.packs[0].name,
                        price: item.packs[0].price,
                        quantity: item.packs[0].quantity,
                        product_url: `${baseUrl}/products/${item.product_id}`,
                    };
                }),
            );

            const emailPayload = {
                email_to: guestEmail,
                total_price: total,
                subtotal_price: subtotal,
                order_number: orderNumber,
                order_items: enrichedCartItems, // Array de productos con productUrl
                url_order: `${baseUrl}/${locale}/checkout/event/success/in_site_payment?order_number=${encodeURIComponent(
                    orderNumber,
                )}`,
                event_name: eventName ?? '',
            };

            // Email al consumidor "invitado"
            await fetch(guestUserUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailPayload),
            });
        }
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: error.message || 'Error creating event order' },
            { status: 500 },
        );
    }

    const createdOrderIds: string[] = [];

    try {
        // Determinar el estado inicial del pedido
        const initialStatus =
            paymentMethod === 'online'
                ? EVENT_ORDER_STATUS.ORDER_PLACED
                : EVENT_ORDER_STATUS.PENDING_PAYMENT;

        // Insertar en event_orders
        const { data: eventOrder, error: orderError } = await supabase
            .from('event_orders')
            .insert({
                customer_id: userId,
                updated_at: new Date().toISOString(),
                event_id: eventId,
                status: initialStatus,
                total: total,
                subtotal: subtotal,
                discount: discount,
                tax: tax,
                currency: currency,
                order_number: orderNumber,
                guest_email: guestEmail || null, // Solo si es invitado
            })
            .select('id, order_number')
            .single();

        if (orderError || !eventOrder) {
            return NextResponse.json(
                { message: 'Error creating event order' },
                { status: 500 },
            );
        }

        createdOrderIds.push(eventOrder.id);

        // Agrupar los items por cp_cps_id
        const eventOrderCps = cartItems.reduce(
            (
                acc: { [key: string]: IProductPackEventCartItem[] },
                item: IProductPackEventCartItem,
            ) => {
                if (!acc[item.cp_cps_id]) {
                    acc[item.cp_cps_id] = [];
                }
                acc[item.cp_cps_id].push(item);
                return acc;
            },
            {},
        );

        // Insertar event_order_cps y event_order_items
        for (const cpCPSId in eventOrderCps) {
            const initialStateForCPs =
                paymentMethod === 'online'
                    ? EVENT_ORDER_CPS_STATUS.PENDING // TODO: VOLVER -> Originalmente era NOT_STARTED y el consumidor debía de presionar en el botón para iniciar el de preparación. De esta manera para eventos más grandes sería útil.
                    : EVENT_ORDER_CPS_STATUS.PENDING_PAYMENT;

            const cpsOrderNumber = generateOrderNumber(paymentMethod);

            const { data: eventOrderCp, error: eventOrderCpError } =
                await supabase
                    .from('event_order_cps')
                    .insert({
                        event_order_id: eventOrder.id,
                        cp_id: cpCPSId,
                        status: initialStateForCPs,
                        order_number: cpsOrderNumber,
                    })
                    .select('id')
                    .single();

            if (eventOrderCpError || !eventOrderCp) {
                return NextResponse.json(
                    { message: 'Error creating event order cp' },
                    { status: 500 },
                );
            }

            for (const item of eventOrderCps[cpCPSId]) {
                for (const pack of item.packs) {
                    const { error: orderItemError } = await supabase
                        .from('event_order_items')
                        .insert({
                            event_order_cp_id: eventOrderCp.id,
                            product_pack_id: pack.id,
                            quantity: pack.quantity,
                            status: EVENT_ORDER_ITEM_STATUS.INITIAL,
                        });

                    if (orderItemError) {
                        return NextResponse.json(
                            { message: 'Error creating event order item' },
                            { status: 500 },
                        );
                    }
                }
            }
        }

        return NextResponse.json(
            { orderId: eventOrder.id, orderNumber: eventOrder.order_number },
            { status: 201 },
        );
    } catch (error: any) {
        console.error(error);

        // Rollback: eliminar órdenes creadas si ocurre un error
        if (createdOrderIds.length > 0) {
            await supabase
                .from('event_orders')
                .delete()
                .in('id', createdOrderIds);
        }

        return NextResponse.json(
            { message: error.message || 'Error creating event order - catch' },
            { status: 500 },
        );
    }
}
