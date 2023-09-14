import { IEventOrder } from "../../../../../../lib/types.d";
import { createServerClient } from "../../../../../../utils/supabaseServer";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { EventOrders } from "./EventOrders";

export default async function OrdersPage() {
  const eventOrdersData = await getEventOrdersData();
  const [eventOrders] = await Promise.all([eventOrdersData]);

  return (
    <>
      <EventOrders eventOrders={eventOrders} />
    </>
  );
}

async function getEventOrdersData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: eventOrdersData, error: eventOrdersError } = await supabase
    .from("event_orders")
    .select(
      `
        *,
        users!event_orders_customer_id_fkey (*)
      `
    )
    .eq("customer_id", session.user.id);
  if (eventOrdersError) throw eventOrdersError;

  return eventOrdersData as IEventOrder[];
}
