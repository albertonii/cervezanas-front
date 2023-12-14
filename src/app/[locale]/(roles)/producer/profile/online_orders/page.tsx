import { IBusinessOrder } from "../../../../../../lib/types";
import createServerClient from "../../../../../../utils/supabaseServer";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { Orders } from "./Orders";
import readUserSession from "../../../../../../lib/actions";

export default async function OrdersPage() {
  const bOrdersData = await getOrdersData();
  const [bOrders] = await Promise.all([bOrdersData]);

  return (
    <>
      <Orders bOrders={bOrders} />
    </>
  );
}

async function getOrdersData() {
  // We need to know all the orders related with the producer
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: bOrdersData, error: bOrdersError } = await supabase
    .from("business_orders")
    .select(
      `
        *,
        order_items (*)
      `
    )
    .eq("producer_id", session.user.id);
  if (bOrdersError) throw bOrdersError;

  return bOrdersData as IBusinessOrder[];
}

// async function getOrdersData() {
//   // We need to know all the orders related with the producer
//   const supabase = await createServerClient();

//   const {
//     data: { session },
//   } = await readUserSession();

//   if (!session) {
//     redirect(VIEWS.SIGN_IN);
//   }

//   const { data: ordersData, error: ordersError } = await supabase
//     .from("orders")
//     .select(
//       `
//         *,
//         business_orders (*)
//       `
//     )
//     .eq("owner_id", session.user.id);
//   if (ordersError) throw ordersError;

//   return ordersData as IOrder[];
// }
