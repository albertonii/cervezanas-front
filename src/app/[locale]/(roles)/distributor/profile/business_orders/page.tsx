import { redirect } from "next/navigation";
import { BusinessOrders } from "./BusinessOrders";
import { VIEWS } from "../../../../../../constants";
import readUserSession from "../../../../../../lib/actions";
import { IBusinessOrder } from "../../../../../../lib/types";
import createServerClient from "../../../../../../utils/supabaseServer";

export default async function BusinessOrdersPage() {
  const bOrdersData = await getBusinessOrdersData();
  const [bOrders] = await Promise.all([bOrdersData]);

  return (
    <>
      <BusinessOrders bOrders={bOrders} />
    </>
  );
}

async function getBusinessOrdersData() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: ordersData, error: ordersError } = await supabase
    .from("business_orders")
    .select(
      `
        *
      `
    )
    .eq("distributor_id", session.user.id);
  if (ordersError) throw ordersError;

  return ordersData as IBusinessOrder[];
}
