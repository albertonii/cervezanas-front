import DisplayEvent from "./DisplayEvent";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../constants";
import { IEvent } from "../../../../../lib/types";
import { createServerClient } from "../../../../../utils/supabaseServer";

export default async function EventsPage({ params }: any) {
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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.ROUTE_SIGNIN);
  }

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
