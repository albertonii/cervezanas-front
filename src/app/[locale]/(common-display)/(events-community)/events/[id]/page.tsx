import DisplayEvent from "./DisplayEvent";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { IEvent } from "../../../../../../lib/types";
import createServerClient from "../../../../../../utils/supabaseServer";
import readUserSession from "../../../../../../lib/actions";

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
    .eq("id", eventId)
    .single();

  console.log(event);

  if (error) console.error(error);

  return event as IEvent;
}
