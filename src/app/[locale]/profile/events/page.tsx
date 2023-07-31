import ProfileEvents from "./ProfileEvents";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { VIEWS } from "../../../../constants";
import { createServerClient } from "../../../../utils/supabaseServer";
import { ICPMobile } from "../../../../lib/types.d";

export default async function EventsPage() {
  const cpsMobileData = getCPMobileData();
  const [cpsMobile] = await Promise.all([cpsMobileData]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileEvents cpsMobile={cpsMobile} />
      </Suspense>
    </>
  );
}

async function getCPMobileData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
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

  return cps[0]?.cp_mobile as ICPMobile[];
}
