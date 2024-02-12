import DisplayEvent from "./DisplayEvent";
import { IEvent } from "../../../../../../lib/types";
import createServerClient from "../../../../../../utils/supabaseServer";

export default async function EventPage({ params }: any) {
  const { id } = params;

  const eventData = getEvent(id);
  const [event] = await Promise.all([eventData]);
  return (
    <>
      <DisplayEvent event={event} />
    </>
  );
}

async function getEvent(eventId: string) {
  const supabase = await createServerClient();

  console.log(eventId);

  const { data: event, error } = await supabase
    .from("events")
    .select(
      `
        *,
        cp_mobile (
          *
        ),
        cp_fixed (
          *
        )

      `
    )
    .eq("id", eventId)
    .single();

  if (error) console.error(error);

  return event as IEvent;
}
