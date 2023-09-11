import { IEventOrder } from "../../../../../../lib/types";
import { createServerClient } from "../../../../../../utils/supabaseServer";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { EventOrders } from "./EventOrders";

export default async function OrdersPage() {
  return (
    <>
      <EventOrders />
    </>
  );
}
