import { IOrder } from "../../../../../../lib/types.d";
import createServerClient from "../../../../../../utils/supabaseServer";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { Orders } from "./Orders";
import readUserSession from "../../../../../actions";

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
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select(
      `
        *,
        business_orders (*)
      `
    )
    .eq("owner_id", session.user.id);
  if (ordersError) throw ordersError;

  return ordersData as IOrder[];
}
