import OrderInvoice from "./OrderInvoice";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../../constants";
import { createServerClient } from "../../../../../../../utils/supabaseServer";
import { IOrder } from "../../../../../../../lib/types";

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
      <OrderInvoice order={order} products={products} />
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
        id,
        created_at,
        updated_at,
        owner_id,
        status,
        customer_name, 
        tracking_id,
        issue_date,
        estimated_date,
        total,
        subtotal,
        shipping,
        tax,
        currency,
        discount,
        discount_code,
        order_number,
        shipping_info_id,
        billing_info_id,
        shipping_info!orders_shipping_info_id_fkey (
          id,
          created_at,
          updated_at,
          owner_id,
          name,
          lastname,
          document_id,
          phone,
          address,
          address_extra,
          address_observations,
          country,
          zipcode,
          city,
          state,
          is_default
        ),
        billing_info!orders_billing_info_id_fkey (
          id,
          created_at,
          updated_at,
          owner_id,
          name,
          lastname,
          document_id,
          phone,
          address,
          country,
          zipcode,
          city,
          state,
          is_default
        ),
        business_orders!business_orders_order_id_fkey (*),
        products(
          id, 
          name, 
          price,
          product_multimedia(*),
          order_items (*)
        )
      `
    )
    .eq("order_number", orderId);

  if (orderError) {
    throw new Error(orderError.message);
  }

  if (!orderData) {
    return {
      order: null,
    };
  }

  return orderData as IOrder;
}
