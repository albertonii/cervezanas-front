import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../constants";
import { createServerClient } from "../../../../../utils/supabaseServer";
import OrderInvoice from "./OrderInvoice";

export default async function OrderInvoicePage({
  params,
}: {
  params: { slug: any };
}) {
  const { slug } = params;
  const orderData = await getInvoiceData(slug);
  const [order] = await Promise.all([orderData]);
  const products = order?.products;

  return (
    <>
      <OrderInvoice order={order[0]} products={products} />
    </>
  );
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
        order_item(*)
      )
    `
    )
    .eq("order_number", orderId);

  if (orderError) {
    throw new Error(orderError.message);
  }

  if (!orderData || orderData.length === 0) {
    return {
      order: null,
      products: [],
    };
  }

  return orderData[0];
}