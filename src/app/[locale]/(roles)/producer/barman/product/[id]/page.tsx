import ManageEventProduct from "./ManageEventProduct";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../../constants";
import { IEventOrderItem } from "../../../../../../../lib/types";
import createServerClient from "../../../../../../../utils/supabaseServer";
import readUserSession from "../../../../../../../lib/actions";

export default async function BarmanProductPage({ params }: any) {
  const { id } = params;
  const eventOrderItemData = getEventOrderItemData(id);
  const [eventOrderItem] = await Promise.all([eventOrderItemData]);
  return (
    <>
      {eventOrderItem ? (
        <ManageEventProduct eventOrderItem={eventOrderItem} />
      ) : (
        <div>
          <h2>No tienes los permisos necesarios para acceder a esta página</h2>
        </div>
      )}
    </>
  );
}

async function getEventOrderItemData(eventOrderItemId: string) {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await readUserSession();

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
            products!product_packs_product_id_fkey (*,
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

  const eventOrderItem = eventOrderItemData as IEventOrderItem;

  if (eventOrderItem.product_packs?.products?.owner_id !== session.user.id) {
    return null;
  }

  return eventOrderItem;
}
