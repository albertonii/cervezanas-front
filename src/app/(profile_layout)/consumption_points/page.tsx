import { ConsumptionPoints } from "../../../components/customLayout";
import { ROUTE_SIGNIN } from "../../../config";
import { createServerClient } from "../../../utils/supabaseServer";

export default async function ProfilePage() {
  const { cps } = await getCPSData();

  return (
    <>
      <ConsumptionPoints cps={cps} />
    </>
  );
}

async function getCPSData() {
  // Create authenticated Supabase Client
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: ROUTE_SIGNIN,
        permanent: false,
      },
    };

  const { data: profileData, error: profileError } = await supabase
    .from("users")
    .select(
      `
        *,
        orders (*),
        campaigns (*),
        customize_settings (*),
        profile_location (*)
      `
    )
    .eq("id", session.user.id);

  if (profileError) throw profileError;
  // Return different data by role
  if (
    profileData[0].role === "producer" ||
    profileData[0].role === "consumer"
  ) {
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
      cps: cps,
    };
  }
}
