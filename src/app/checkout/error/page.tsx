import React from "react";
import { VIEWS } from "../../../constants";
import { createServerClient } from "../../../utils/supabaseServer";
import { decodeBase64 } from "../../../utils/utils";
import ErrorCheckout from "./ErrorCheckout";

export default async function Error({ params }: { params: { slug: any } }) {
  const { slug } = params;
  const orderData = await getCheckoutErrorData(slug);
  const [order] = await Promise.all([orderData]);
  const products = order?.products;

  return (
    <>
      <ErrorCheckout order={order[0]} products={products ?? []} />
    </>
  );
}

async function getCheckoutErrorData(slug: any) {
  const { Ds_MerchantParameters } = slug.query as {
    Ds_MerchantParameters: string;
    Ds_SignatureVersion: string;
    Ds_Signature: string;
  };

  const { Ds_Order: orderId, Ds_Response } = JSON.parse(
    decodeBase64(Ds_MerchantParameters)
  );

  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: VIEWS.ROUTE_SIGNIN,
        permanent: false,
      },
    };

  if (Ds_Response === "9915") {
    // Update order status to user_cancelled
    const { error: statusError } = await supabase
      .from("orders")
      .update({ status: "user_cancelled" })
      .eq("order_number", orderId);

    if (statusError) {
      console.error(statusError.message);
    }
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
    console.error(orderError.message);
    return {
      isError: true,
      order: null,
      products: null,
    };
  }

  if (!orderData || orderData.length === 0) {
    return {
      order: null,
      products: null,
    };
  }

  return orderData[0];
}
