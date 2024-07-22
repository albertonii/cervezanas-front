import { IEventOrder } from '@/lib//types/types';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { EventOrders } from './EventOrders';
import readUserSession from '@/lib//actions';

export default async function OrdersPage() {
    const eventOrdersData = await getEventOrdersData();
    const [eventOrders] = await Promise.all([eventOrdersData]);

    return (
        <>
            <EventOrders eventOrders={eventOrders} />
        </>
    );
}

async function getEventOrdersData() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data: eventOrdersData, error: eventOrdersError } = await supabase
        .from('event_orders')
        .select(
            `
        *,
        users!event_orders_customer_id_fkey (
          *
        )
      `,
        )
        .eq('customer_id', session.id);
    if (eventOrdersError) throw eventOrdersError;

    return eventOrdersData as IEventOrder[];
}
