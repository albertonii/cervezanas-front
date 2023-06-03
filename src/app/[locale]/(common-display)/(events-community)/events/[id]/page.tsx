import DisplayEvent from "./DisplayEvent";
import { IEvent } from "../../../../../../lib/types.d";
import { createServerClient } from "../../../../../../utils/supabaseServer";

export default async function EventPage({ params }: any) {
  const { id } = params;

  const eventData = getEvent(id);
  const [event] = await Promise.all([eventData]);
  return (
    <>
      <DisplayEvent event={event[0]} />
    </>
  );
}

async function getEvent(eventId: string) {
  const supabase = createServerClient();

  const { data: event, error } = await supabase
    .from("events")
    .select(
      `
            *,
            owner_id (*),
            cp_mobile (*)

        `
    )
    .eq("id", eventId);
  if (error) console.error(error);

  return event as IEvent[];
}
