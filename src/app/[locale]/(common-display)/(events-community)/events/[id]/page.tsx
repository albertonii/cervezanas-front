import DisplayEvent from './DisplayEvent';
import readUserSession from '@/lib//actions';
import createServerClient from '@/utils/supabaseServer';
import { IEvent } from '@/lib/types/eventOrders';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { IBMExperienceParticipants } from '@/lib/types/quiz';
import { IEventExperience } from '@/lib/types/types';

export default async function EventPage({ params }: any) {
    const { id } = params;

    const eventData = getEvent(id);
    const cpsByEventData = getCPByEventId(id);
    const eventExperiencesData = getEventExperiences(id);
    const experienceParticipantData = getBMExperienceParticipants(id);

    const [event, cpsByEvent, eventExperiences, experienceParticipant] =
        await Promise.all([
            eventData,
            cpsByEventData,
            eventExperiencesData,
            experienceParticipantData,
        ]);

    return (
        <DisplayEvent
            event={event}
            cpsEvents={cpsByEvent}
            eventExperiences={eventExperiences}
            experienceParticipant={experienceParticipant}
        />
    );
}

async function getCPByEventId(eventId: string) {
    const supabase = await createServerClient();

    const { data: event, error } = await supabase
        .from('cp_events')
        .select(
            `
            *,
            cp (*)
          `,
        )
        .eq('event_id', eventId);

    if (error) console.error(error);

    return event as IConsumptionPointEvent[];
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

    return event as IEvent;
}

async function getEventExperiences(eventId: string) {
    const supabase = await createServerClient();

    const { data: eventExperiences, error } = await supabase
        .from('event_experiences')
        .select(
            `
            *,
            experiences (*)
          `,
        )
        .eq('event_id', eventId);

    if (error) console.error(error);

    return eventExperiences as IEventExperience[];
}

async function getBMExperienceParticipants(eventId: string) {
    const supabase = await createServerClient();
    const session = await readUserSession();

    const { data: experienceParticipation, error } = await supabase
        .from('bm_experience_participants')
        .select(
            `
            *
            
          `,
        )
        .eq('event_id', eventId)
        .eq('gamification_id', session?.id as string);

    if (error) console.error(error);

    return experienceParticipation as IBMExperienceParticipants[];
}
