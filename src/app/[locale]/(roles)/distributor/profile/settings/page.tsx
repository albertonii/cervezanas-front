import Profile from "./Profile";
import { createServerClient } from "../../../../../../utils/supabaseServer";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { IDistributorUser } from "../../../../../../lib/types";

export default async function ProfilePage() {
  const profile = await getProfileData();
  if (!profile) return <></>;

  return (
    <>
      <Profile profile={profile} />
    </>
  );
}

async function getProfileData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: profileData, error: profileError } = await supabase
    .from("distributor_user")
    .select(
      `
        user,
        created_at,
        nif,
        bank_account,
        company_name,
        company_description,
        location_id
      `
    )
    .eq("user", session.user.id)
    .single();

  if (profileError) throw profileError;
  return profileData as IDistributorUser;
}
