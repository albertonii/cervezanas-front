import { IOrder } from "../../../../../../lib/types";
import createServerClient from "../../../../../../utils/supabaseServer";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { Orders } from "./Orders";
import readUserSession from "../../../../../../lib/actions";

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
        *
      `
    )
    .eq("owner_id", session.user.id);
  if (ordersError) throw ordersError;

  return ordersData as IOrder[];
}
