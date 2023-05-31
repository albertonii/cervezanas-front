import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import {
  isResponseCodeOk,
  ResponseJSONSuccess,
  ThreeDSv1ChallengeNotificationBody,
} from "redsys-easy";
import { processRestNotification } from "../../../components/TPV";

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse,
  request: {
    body: ThreeDSv1ChallengeNotificationBody;
  }
) {
  const notificationBody = request.body as unknown as ResponseJSONSuccess;
  // console.log("Notification: ", notificationBody);

  // Always validate a notification
  const params = processRestNotification(notificationBody);
  console.log("Params: ", params);
  // console.log("Params: ", params);
  // const orderId = params.Ds_Order;

  // if (isResponseCodeOk(params.Ds_Response)) {
  // eslint-disable-next-line no-console
  // console.log(`Payment for order ${orderId} succeded`);
  // db.orderPayments.update(orderId, { status: "PAYMENT_SUCCEDED" });

  // const supabase = createServerClient();

  // // Update order status
  // const { data, error } = await supabase.from("orders").select("*");
  // if (error) console.error(error);

  // console.log(data);
  // } else {
  // eslint-disable-next-line no-console
  // console.log(`Payment for order ${orderId} failed`);
  // db.orderPayments.update(orderId, { status: "PAYMENT_FAILED" });
  // }

  return NextResponse.json({ message: "prueba" });
}
