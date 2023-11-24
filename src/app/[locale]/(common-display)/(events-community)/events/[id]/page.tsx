import DisplayEvent from "./DisplayEvent";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { IEvent } from "../../../../../../lib/types";
import createServerClient from "../../../../../../utils/supabaseServer";
import readUserSession from "../../../../../actions";

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
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: event, error } = await supabase
    .from("events")
    .select(
      `
        *,
        owner_id,
        cp_mobile (*)
      `
    )
    .eq("id", eventId);

  // users!events_owner_id_fkey (*),

  if (error) console.error(error);

  return event as IEvent[];
}
