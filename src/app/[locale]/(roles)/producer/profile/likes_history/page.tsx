import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { ILike } from "../../../../../../lib/types";
import createServerClient from "../../../../../../utils/supabaseServer";
import { LikesHistory } from "./LikesHistory";

export default async function LikesPage() {
  const { likes } = await getLikesData();
  if (!likes) return null;

  return (
    <>
      <LikesHistory likes={likes} />
    </>
  );
}

async function getLikesData() {
  const supabase = await createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: likesData, error: likesError } = await supabase
    .from("likes")
    .select(
      `
        *
      `
    )
    .eq("owner_id", session.user.id);

  if (likesError) throw likesError;

  return { likes: likesData as ILike[] };
}
