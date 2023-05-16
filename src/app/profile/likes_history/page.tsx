import { LikesHistory } from "../../../components/customLayout";
import { ROUTE_SIGNIN } from "../../../config";
import { ILike } from "../../../lib/types.d";
import { createServerClient } from "../../../utils/supabaseServer";

export default async function LikesPage() {
  const { likes } = await getLikesData();

  return (
    <>
      <LikesHistory likes={likes!} />
    </>
  );
}

async function getLikesData() {
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

  const { data: likesData, error: likesError } = await supabase
    .from("likes")
    .select(
      `
        *,
        product_id (*),
      `
    )
    .eq("owner_id", session.user.id);

  if (likesError) throw likesError;

  return { likes: likesData as ILike[] };
}
