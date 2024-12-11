import { IEventOrderCPS } from '@/lib/types/eventOrders';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

async function sendPickupEmail(eventOrderInCP: IEventOrderCPS) {
    try {
        const emailTo = eventOrderInCP.event_orders?.users?.email
            ? eventOrderInCP.event_orders?.users?.email
            : eventOrderInCP.event_orders?.guest_email;

        if (!emailTo) {
            console.error('No email found');
            return;
        }

        // Construir el objeto de datos para enviar como JSON
        const data = {
            email_to: emailTo,
            order_number: eventOrderInCP.order_number,
            cp_name: eventOrderInCP.cp_events?.cp_name || '',
            event_name: eventOrderInCP.event_orders?.events?.name || '',
            stand_location: eventOrderInCP.cp_events?.stand_location || '',
            products: eventOrderInCP.event_order_items?.map((item) => ({
                product_name: item.product_packs?.products?.name || '',
                pack_name: item.product_packs?.name || '',
                quantity: item.quantity,
                price: item.product_packs?.price || '',
            })),
        };

        const url = `${baseUrl}/api/emails/event_order_in_cp_completed`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error notifying API: %s', error);
    }
}

export { sendPickupEmail };
