import SuccessCheckout from "./SuccessCheckout";
import { redirect } from "next/navigation";
import { decodeBase64 } from "../../../../../../../utils/utils";
import createServerClient from "../../../../../../../utils/supabaseServer";
import readUserSession from "../../../../../../../lib/actions";
import { VIEWS } from "../../../../../../../constants";
import { IOrder } from "../../../../../../../lib/types";

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
  return <>{order && <SuccessCheckout order={order} isError={isError} />}</>;
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
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select(
      `
      id,
      owner_id,
      status,
      shipping_info_id,
      billing_info_id,
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
      shipping_info (id, *),
      billing_info (id, *),
      business_orders!business_orders_order_id_fkey (
        *,
        distributor_user!business_orders_distributor_id_fkey (*,
          users(
            name,
            lastname,
            email,
            username,
            avatar_url
          )
        ),
        order_items!order_items_business_order_id_fkey (
          *,
          product_packs (
            *,
            products (
              id,
              name,
              description
            )
          )
        )
      ),
      payment_method_card!orders_payment_method_id_fkey (*),
      payment_method_id
    `
    )
    .eq("order_number", orderNumber)
    .eq("business_orders.producer_id", session.user.id)
    .single();

  if (!orderData)
    return {
      orderData: null,
      isError: true,
    };

  if (orderError) {
    console.error(orderError);
    return {
      orderData: null,
      isError: true,
    };
  }

  return { orderData: orderData as IOrder, isError: false };
}