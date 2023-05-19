import { redirect } from "next/navigation";
import { ConsumptionPoints } from "../../../components/customLayout";
import { VIEWS } from "../../../constants";
import { IProfile, IConsumptionPoints } from "../../../lib/types.d";
import { createServerClient } from "../../../utils/supabaseServer";

export default async function ProfilePage() {
  const { cps, profile } = await getCPSData();
  if (!profile) return <></>;

  return (
    <>
      <ConsumptionPoints cps={cps ?? []} profile={profile} />
    </>
  );
}

async function getCPSData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.ROUTE_SIGNIN);
  }

  const { data: profileData, error: profileError } = await supabase
    .from("users")
    .select(
      `
        cp_organizer_status
      `
    )
    .eq("id", session.user.id);

  if (profileError) throw profileError;

  // Return different data by role

  const { data: cps, error: cpsError } = await supabase
    .from("consumption_points")
    .select(
      `
        *,
        cp_fixed (*),
        cp_mobile (*)
      `
    )
    .eq("owner_id", session.user.id);
  if (cpsError) console.error(cpsError);

  return {
    cps: cps as IConsumptionPoints[],
    profile: profileData[0] as IProfile,
  };
}
