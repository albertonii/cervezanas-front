import { NextRequest, NextResponse } from "next/server";
import { isResponseCodeOk, ResponseJSONSuccess } from "redsys-easy";
import { processRestNotification } from "../../../components/TPV";
import { MARKETPLACE_ORDER_STATUS } from "../../../constants";
import { createServerClient } from "../../../utils/supabaseServer";
// import { processRestNotification } from "../../../components/TPV";

export async function POST(req: NextRequest) {
  // const data = await req.json();
  const data = await req.formData();
  // const urlNotification = new URL(req.url);
  // const { searchParams } = urlNotification;
  const signatureVersion = data.get("Ds_SignatureVersion");
  const merchantParameters = data.get("Ds_MerchantParameters");
  const signature = data.get("Ds_Signature");

  const body: ResponseJSONSuccess = {
    Ds_Signature: signature as string,
    Ds_SignatureVersion: signatureVersion as string,
    Ds_MerchantParameters: merchantParameters as string,
  };

  const restNotification = processRestNotification(body);
  const responseCode = restNotification.Ds_Response;
  // Always validate a notification

  const orderId = restNotification.Ds_Order;
  const supabase = createServerClient();

  if (isResponseCodeOk(responseCode)) {
    console.log(`Payment for order ${orderId} succeded`);

    // Update order status
    const { error } = await supabase
      .from("orders")
      .update({ status: MARKETPLACE_ORDER_STATUS.PAID })
      .eq("order_number", orderId);
    if (error) console.error(error);
    return NextResponse.json({
      message: `Order number ${orderId} updated successfully`,
    });
  } else {
    console.log(`Payment for order ${orderId} failed`);

    // Update order status
    const { error } = await supabase
      .from("orders")
      .update({ status: MARKETPLACE_ORDER_STATUS.ERROR })
      .eq("order_number", orderId);
    if (error) console.error(error);

    return NextResponse.json({
      message: `Order number ${orderId} failed with error`,
    });
  }
}
