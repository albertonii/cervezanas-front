import createServerClient from "../../../../../../utils/supabaseServer";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import readUserSession from "../../../../../../lib/actions";

export default async function OrdersPage() {
  const coverageAreaData = await getCoverageAreaData();
  const [coverageArea] = await Promise.all([coverageAreaData]);

  return <>{/* <CoverageLayout coverageArea={coverageArea} /> */}</>;
}

async function getCoverageAreaData() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: coverage_area, error: ordersError } = await supabase
    .from("coverage_areas")
    .select(
      `
        *
      `
    )
    .eq("distributor_id", session.user.id);
  if (ordersError) throw ordersError;

  return coverage_area;
}
