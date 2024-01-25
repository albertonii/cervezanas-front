import { redirect } from "next/navigation";
import { BusinessOrders } from "./BusinessOrders";
import { VIEWS } from "../../../../../../constants";
import readUserSession from "../../../../../../lib/actions";
import { IOrder } from "../../../../../../lib/types";
import createServerClient from "../../../../../../utils/supabaseServer";

export default async function BusinessOrdersPage() {
  const ordersData = await getBusinessOrdersData();
  const [orders] = await Promise.all([ordersData]);

  return (
    <>
      <BusinessOrders orders={orders} />
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
    .eq("business_orders.distributor_id", [session.user.id])
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as IOrder[];
}
