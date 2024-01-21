import { IReview } from "../../../../../../lib/types";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { Reviews } from "./Reviews";
import createServerClient from "../../../../../../utils/supabaseServer";

export default async function ReviewsPage() {
  const reviewsData = await getReviewsData();
  const [reviews] = await Promise.all([reviewsData]);

  if (!reviews) return <></>;

  return (
    <>
      <Reviews reviews={reviews} />
    </>
  );
}

async function getReviewsData() {
  const supabase = await createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: reviewsData, error: reviewsError } = await supabase
    .from("reviews")
    .select(
      `
        *,
        products (
          *,
          product_multimedia (
            *
          )
        ),
        users (
          id,
          username,
          avatar_url
        )
      `
    )
    .eq("owner_id", session.user.id);

  if (reviewsError) throw reviewsError;

  return reviewsData as IReview[];
}
