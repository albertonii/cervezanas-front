import DisplayEvent from './DisplayEvent';
import createServerClient from '../../../../../../utils/supabaseServer';
import {
    ICPF_events,
    ICPM_events,
    IEvent,
} from '../../../../../../lib/types/types';

export default async function EventPage({ params }: any) {
    const { id } = params;

    const eventData = getEvent(id);
    const cpMobilesData = getCPMobilesFromEvent(id);
    const cpFixedsData = getCPFixedsFromEvent(id);

    const [event, cpmEvents, cpfEvents] = await Promise.all([
        eventData,
        cpMobilesData,
        cpFixedsData,
    ]);

    return (
        <DisplayEvent
            event={event}
            cpmEvents={cpmEvents}
            cpfEvents={cpfEvents}
        />
    );
}

async function getCPMobilesFromEvent(eventId: string) {
    const supabase = await createServerClient();

    const { data: event, error } = await supabase
        .from('cpm_events')
        .select(
            `
            *,
            cp_mobile (*),
            events (*)
          `,
        )
        .eq('event_id', eventId);

    if (error) console.error(error);

    return event as ICPM_events[];
}

async function getCPFixedsFromEvent(eventId: string) {
    const supabase = await createServerClient();

    const { data: event, error } = await supabase
        .from('cpf_events')
        .select(
            `
            *,
            cp_fixed (*),
            events (*)
          `,
        )
        .eq('event_id', eventId);

    if (error) console.error(error);

    return event as ICPF_events[];
}

async function getEvent(eventId: string) {
    const supabase = await createServerClient();

    const { data: event, error } = await supabase
        .from('events')
        .select(
            `
            *
          `,
        )
        .eq('id', eventId)
        .single();

    if (error) console.error(error);

    console.log(event);
    return event as IEvent;
}
