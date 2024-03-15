import DisplayEvent from './DisplayEvent';
import createServerClient from '../../../../../../utils/supabaseServer';
import {
    ICPF_events,
    ICPM_events,
    IEvent,
} from '../../../../../../lib/types/types';
import {
    IBMExperienceParticipants,
    IEventExperience,
} from '../../../../../../lib/types/quiz';
import readUserSession from '../../../../../../lib/actions';

export default async function EventPage({ params }: any) {
    const { id } = params;

    const eventData = getEvent(id);
    const cpMobilesData = getCPMobilesFromEvent(id);
    const cpFixedsData = getCPFixedsFromEvent(id);
    const eventExperiencesData = getEventExperiences(id);
    const experienceParticipantData = getBMExperienceParticipants(id);

    const [
        event,
        cpmEvents,
        cpfEvents,
        eventExperiences,
        experienceParticipant,
    ] = await Promise.all([
        eventData,
        cpMobilesData,
        cpFixedsData,
        eventExperiencesData,
        experienceParticipantData,
    ]);

    return (
        <DisplayEvent
            event={event}
            cpmEvents={cpmEvents}
            cpfEvents={cpfEvents}
            eventExperiences={eventExperiences}
            experienceParticipant={experienceParticipant}
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
