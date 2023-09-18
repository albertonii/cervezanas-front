import OrderInvoice from "./OrderInvoice";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { createServerClient } from "../../../../../../utils/supabaseServer";

export default async function OrderInvoicePage({
  params,
}: {
  params: { slug: any };
}) {
  const { slug } = params;
  const orderData = await getInvoiceData(slug);
  const [order] = await Promise.all([orderData]);

  return <>{order ?? <OrderInvoice order={order} />}</>;
}

async function getInvoiceData(slug: any) {
  const { orderInvoice: orderId } = slug;

  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select(
      `
      *,
      shipping_info(id, *),
      billing_info(id, *),
      products(
        id, 
        name, 
        price,
        product_multimedia(*),
        order_items (*)
      ),
      payment_method_id
    `
    )
    .eq("order_number", orderId)
    .single();

  if (orderError) {
    throw new Error(orderError.message);
  }

  if (!orderData) {
    return {
      order: null,
    };
  }

  return orderData;
}
