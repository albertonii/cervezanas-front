import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../../constants";
import { IEventOrderItem } from "../../../../../../../lib/types";
import { createServerClient } from "../../../../../../../utils/supabaseServer";
import ManageEventProduct from "./ManageEventProduct";

export default async function BarmanProductPage({ params }: any) {
  const { id } = params;
  const eventOrderItemData = getEventOrderItemData(id);
  const [eventOrderItem] = await Promise.all([eventOrderItemData]);
  if (!eventOrderItem) return <></>;
  return (
    <div className="container">
      <ManageEventProduct eventOrderItem={eventOrderItem} />
    </div>
  );
}

async function getEventOrderItemData(id: string) {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: eventOrderItemData, error: eventOrderItemError } =
    await supabase
      .from("event_order_items")
      .select(
        `
        *,
        product_id (*,
          product_multimedia (*,
            p_principal)
        )
      `
      )
      .eq("id", id);

  if (eventOrderItemError) throw eventOrderItemError;

  return eventOrderItemData[0] as IEventOrderItem;
}
