import { NextResponse } from "next/server";
import { isResponseCodeOk, ResponseJSONSuccess } from "redsys-easy";
import { processRestNotification } from "../../../components/TPV";
import { createServerClient } from "../../../utils/supabaseServer";
import { decodeBase64 } from "../../../utils/utils";

export async function POST(request: Request, response: Response) {
  console.log(request);

  const notificationBody = request.body as unknown as ResponseJSONSuccess;

  // Always validate a notification
  const params = processRestNotification(notificationBody);
  const orderId = params.Ds_Order;

  if (isResponseCodeOk(params.Ds_Response)) {
    // eslint-disable-next-line no-console
    console.log(`Payment for order ${orderId} succeded`);
    // db.orderPayments.update(orderId, { status: "PAYMENT_SUCCEDED" });
  } else {
    // eslint-disable-next-line no-console
    console.log(`Payment for order ${orderId} failed`);
    // db.orderPayments.update(orderId, { status: "PAYMENT_FAILED" });
  }

  // In this case redsys doesn't care about the response body
  // response.status = 204;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return

  // const { searchParams } = new URL(request.url);
  // const { Ds_MerchantParameters } = searchParams as any;

  // console.log(Ds_MerchantParameters);
  // //  as {
  //   Ds_MerchantParameters: string;
  //   Ds_SignatureVersion: string;
  //   Ds_Signature: string;
  // };

  // const { Ds_Order: orderNumber } = JSON.parse(
  //   decodeBase64(Ds_MerchantParameters)
  // );

  // const supabase = createServerClient();

  // // Update order status
  // const { data, error } = await supabase.from("orders").select("*");
  // if (error) console.error(error);

  // console.log(data);
  return NextResponse.json({ message: "prueba" });
}
