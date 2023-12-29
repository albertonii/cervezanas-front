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

  // Select only the orders where business orders have the distributor_id associated to session user id
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        *, 
        business_orders (
          *
        )
      `
    )
    .eq("business_orders.producer_id", [session.user.id])
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as IOrder[];
}
