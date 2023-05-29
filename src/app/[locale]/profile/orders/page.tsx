import { IOrder } from "../../../../lib/types";
import { createServerClient } from "../../../../utils/supabaseServer";
import { Orders } from "../../../../components/customLayout";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../constants";

export default async function OrdersPage() {
  const ordersData = await getOrdersData();
  const [orders] = await Promise.all([ordersData]);

  return (
    <>
      <Orders orders={orders} />
    </>
  );
}

async function getOrdersData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.ROUTE_SIGNIN);
  }

  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select(
      `
        *
      `
    )
    .eq("owner_id", session.user.id);
  if (ordersError) throw ordersError;

  return ordersData as IOrder[];
}
