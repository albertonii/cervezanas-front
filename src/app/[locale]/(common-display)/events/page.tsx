import { IEvent } from "../../../../lib/types.d";
import { createServerClient } from "../../../../utils/supabaseServer";
import Events from "./Events";

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
  const supabase = createServerClient();
  const { data: event, error } = await supabase.from("events").select(
    `
      *,
      owner_id (*),
      cp_mobile (*)
    `
  );
  if (error) console.error(error);
  return event as IEvent[];
}
