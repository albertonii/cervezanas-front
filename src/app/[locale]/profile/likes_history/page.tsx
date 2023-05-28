import { redirect } from "next/navigation";
import { LikesHistory } from "../../../../components/customLayout";
import { ROUTE_SIGNIN } from "../../../../config";
import { VIEWS } from "../../../../constants";
import { ILike } from "../../../../lib/types";
import { createServerClient } from "../../../../utils/supabaseServer";

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
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.ROUTE_SIGNIN);
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
