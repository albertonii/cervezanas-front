import SuccessCheckout from "./SuccessCheckout";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../../../../constants";
import { IEventOrder } from "../../../../../../../../../lib/types";
import { decodeBase64 } from "../../../../../../../../../utils/utils";
import { headers } from "next/headers";
import createServerClient from "../../../../../../../../../utils/supabaseServer";

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
  const headersList = headers();

  const domain = headersList.get("host"); // to get domain

  if (!domain) {
    return <></>;
  }

  const { orderData, isError } = await getSuccessData(searchParams);
  const [order] = await Promise.all([orderData]);

  return (
    <>
      {order && (
        <SuccessCheckout order={order} isError={isError} domain={domain} />
      )}
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

  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: orderData, error: orderError } = await supabase
    .from("event_orders")
    .select(
      `
      id, 
      created_at,
      updated_at,
      customer_id,
      event_id,
      status,
      total,
      subtotal,
      tax,
      currency,
      discount,
      discount_code,
      order_number,
      payment_method_id,
      event_order_items (
        *,
        product_pack_id,
        product_packs (
          *,
          products (
            name,
            description
          )
        )
      ),
      users (*),
      events (*),
      payment_method_card (
        *
      )
    `
    )
    .eq("order_number", orderNumber)
    .single();

  if (orderError) {
    console.error(orderError.message);
    return {
      orderData: null,
      isError: true,
    };
  }

  if (!orderData) {
    return {
      orderData: null,
      isError: true,
    };
  }

  return { orderData: orderData as IEventOrder, isError: false };
}
