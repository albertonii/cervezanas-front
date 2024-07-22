import Events from './Events';
import createServerClient from '@/utils/supabaseServer';
import { IEvent } from '@/lib//types/types';

export default async function EventsPage() {
    const eventsData = getEvents();
    const [events] = await Promise.all([eventsData]);

    return (
        <>
            <Events events={events} />
        </>
    );
}

async function getEvents() {
    const supabase = await createServerClient();
    const { data: event, error } = await supabase
        .from('events')
        .select(
            `
            *,
            users (*)
          `,
        )
        .eq('is_activated', true);

    if (error) console.error(error);
    return event as IEvent[];
}
