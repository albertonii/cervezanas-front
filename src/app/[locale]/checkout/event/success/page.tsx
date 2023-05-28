import SuccessCheckout from "./SuccessCheckout";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../constants";
import { IEventOrder } from "../../../../../lib/types";
import { createServerClient } from "../../../../../utils/supabaseServer";
import { decodeBase64 } from "../../../../../utils/utils";

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
        default: "Success page for checkout",
        template: `%s | Cervezanas`,
      },
      description: "Checkout order information displaying in this page",
    };
  } catch (error) {
    return {
      title: "Not found",
      description: "The page you are looking for does not exists",
    };
  }
}

export default async function SuccessPage({ searchParams }: any) {
  const { orderData, isError } = await getSuccessData(searchParams);
  const [order] = await Promise.all([orderData]);
  if (!order) return <></>;

  return (
    <>
      <SuccessCheckout order={order} isError={isError} />
    </>
  );
}

async function getSuccessData(searchParams: any) {
  const { Ds_MerchantParameters } = searchParams as {
    Ds_MerchantParameters: string;
    Ds_SignatureVersion: string;
    Ds_Signature: string;
  };

  const { Ds_Order: orderNumber } = JSON.parse(
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

  const { data: orderData, error: orderError } = await supabase
    .from("event_orders")
    .select(
      `
      *,
      event_order_items (
        *,
         product_id (
          id, 
          name, 
          price,
          product_multimedia(*),
          beers (*)
        )
      )
    `
    )
    .eq("order_number", orderNumber);

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

  return { orderData: orderData[0] as IEventOrder, isError: false };
}
