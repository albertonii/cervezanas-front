import { ROUTE_SIGNIN } from "../../../config";
import { IOrder } from "../../../lib/types.d";
import { createServerClient } from "../../../utils/supabaseServer";
import { Orders } from "../../../components/customLayout";

export default async function OrdersPage() {
  const { orders } = await getOrdersData();

  return (
    <>
      <Orders orders={orders!} />
    </>
  );
}

async function getOrdersData() {
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

  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select(
      `
        *
      `
    )
    .eq("owner_id", session.user.id);

  if (ordersError) throw ordersError;

  return { orders: ordersData as IOrder[] };
}
