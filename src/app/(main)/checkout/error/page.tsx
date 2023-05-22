import ErrorCheckout from "./ErrorCheckout";
import React from "react";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../constants";
import { IOrder } from "../../../../lib/types.d";
import { createServerClient } from "../../../../utils/supabaseServer";
import { decodeBase64 } from "../../../../utils/utils";

export async function generateMetadata({ searchParams }: any) {
  try {
    const { Ds_MerchantParameters } = searchParams as {
      Ds_MerchantParameters: string;
      Ds_SignatureVersion: string;
      Ds_Signature: string;
    };

    if (!Ds_MerchantParameters) {
      return {
        title: "Not found",
        description: "The page you are looking for does not exists",
      };
    }

    return {
      title: {
        default: "Error page for checkout",
        template: `%s | Cervezanas`,
      },
      description:
        "Error page for checkout reached by code sent from Checkout Order",
    };
  } catch (error) {
    return {
      title: "Not found",
      description: "The page you are looking for does not exists",
    };
  }
}

export default async function Error({ searchParams }: any) {
  const { orderData, isError } = await getCheckoutErrorData(searchParams);
  const [order] = await Promise.all([orderData]);
  if (!order) return <></>;
  return (
    <>
      <ErrorCheckout order={order} isError={isError} />
    </>
  );
}

async function getCheckoutErrorData(searchParams: any) {
  const { Ds_MerchantParameters } = searchParams as {
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

  if (!session) {
    redirect(VIEWS.ROUTE_SIGNIN);
  }

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
      orderData: null,
      isError: true,
    };
  }

  if (!orderData || orderData.length === 0) {
    return {
      orderData: null,
      isError: true,
    };
  }

  return { orderData: orderData[0] as IOrder, isError: false };
}
