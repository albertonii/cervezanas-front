import ManageEventProduct from "./ManageEventProduct";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../../constants";
import { IEventOrderItem } from "../../../../../../../lib/types.d";
import { createServerClient } from "../../../../../../../utils/supabaseServer";

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

async function getEventOrderItemData(eventOrderItemId: string) {
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
        product_packs!event_order_items_product_pack_id_fkey (
          *,
            product_id (*,
              product_multimedia (
                p_principal
              )
            )
        )
        
      `
      )
      .eq("id", eventOrderItemId)
      .single();

  if (eventOrderItemError) throw eventOrderItemError;

  return eventOrderItemData as IEventOrderItem;
}
