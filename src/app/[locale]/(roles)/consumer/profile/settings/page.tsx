import Profile from "./Profile";
import { IUserTable } from "../../../../../../lib/types";
import createServerClient from "../../../../../../utils/supabaseServer";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { Suspense } from "react";

export default async function ProfilePage() {
  const { profile } = await getProfileData();
  if (!profile) return <></>;

  return (
    <Suspense fallback={<h3>cargando..</h3>}>
      <Profile profile={profile} />
    </Suspense>
  );
}

async function getProfileData() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

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
    .eq("id", session.user.id)
    .single();

  if (profileError) throw profileError;

  return { profile: profileData as IUserTable };
}
