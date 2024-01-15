import { NextRequest, NextResponse } from "next/server";
import {
  createRedsysAPI,
  isResponseCodeOk,
  ResponseJSONSuccess,
  SANDBOX_URLS,
} from "redsys-easy";
import { EVENT_ORDER_STATUS } from "../../../../constants";
import createServerClient from "../../../../utils/supabaseServer";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const signatureVersion = data.get("Ds_SignatureVersion");
  const merchantParameters = data.get("Ds_MerchantParameters");
  const signature = data.get("Ds_Signature");

  const body: ResponseJSONSuccess = {
    Ds_Signature: signature as string,
    Ds_SignatureVersion: signatureVersion as string,
    Ds_MerchantParameters: merchantParameters as string,
  };

  const { processRestNotification } = createRedsysAPI({
    urls: SANDBOX_URLS,
    secretKey: "sq7HjrUOBfKmC576ILgskD5srU870gJ7",
  });

  const restNotification = processRestNotification(body);

  const responseCode = restNotification.Ds_Response;

  const orderId = restNotification.Ds_Order;

  const supabase = await createServerClient();

  if (isResponseCodeOk(responseCode)) {
    console.info(`Payment for event order ${orderId} succeded`);

    // Update order status
    const { error } = await supabase
      .from("orders")
      .update({ status: EVENT_ORDER_STATUS.PAID })
      .eq("order_number", orderId);
    if (error) console.error(error);
    return NextResponse.json({
      message: `Event order number ${orderId} updated successfully`,
    });
  } else {
    console.info(`Payment for event order ${orderId} failed`);

    // Update order status
    const { error } = await supabase
      .from("event_orders")
      .update({ status: EVENT_ORDER_STATUS.ERROR })
      .eq("order_number", orderId);
    if (error) console.error(error);

    return NextResponse.json({
      message: `Event order number ${orderId} failed with error`,
    });
  }
}
