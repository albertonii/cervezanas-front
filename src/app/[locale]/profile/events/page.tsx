import ProfileEvents from "./ProfileEvents";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { VIEWS } from "../../../../constants";
import { createServerClient } from "../../../../utils/supabaseServer";
import { ICPMobile, IEvent } from "../../../../lib/types";

export default async function EventsPage() {
  const cpsMobileData = getCPMobileData();
  const eventsData = getEventsData();
  const [cpsMobile, events] = await Promise.all([cpsMobileData, eventsData]);
  if (!events) return <></>;
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileEvents events={events} cpsMobile={cpsMobile} />;
      </Suspense>
    </>
  );
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

  return eventsData as IEvent[];
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

  return cps[0].cp_mobile as ICPMobile[];
}
