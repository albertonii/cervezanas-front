import { redirect } from "next/navigation";
import { VIEWS } from "../../../constants";
import { ICPMobile, IEvent } from "../../../lib/types.d";
import { createServerClient } from "../../../utils/supabaseServer";
import Events from "./Events";

export default async function EventsPage() {
  const { cpsMobileData } = await getCPMobileData();
  const { eventsData } = await getEventsData();
  const [cpsMobile, events] = await Promise.all([cpsMobileData, eventsData]);
  if (!events) return <></>;
  console.log(events);
  return <Events events={events} cpsMobile={cpsMobile} />;
}

async function getEventsData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.ROUTE_SIGNIN);
  }

  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select(
      `
        *,
        cp_mobile (*)
      `
    )
    .eq("owner_id", session.user.id);

  if (eventsError) throw eventsError;

  return {
    eventsData: eventsData as IEvent[],
  };
}

async function getCPMobileData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.ROUTE_SIGNIN);
  }
  const { data: cps, error: cpError } = await supabase
    .from("consumption_points")
    .select(
      `
      *,
      cp_mobile (*)
      `
    )
    .eq("owner_id", session.user.id);

  if (cpError) throw cpError;

  return {
    cpsMobileData: cps[0].cp_mobile as ICPMobile[],
  };
}
