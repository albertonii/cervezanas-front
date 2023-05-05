import type { NextApiRequest, NextApiResponse } from "next";
import paypal from "@paypal/checkout-server-sdk";
import client from "../../../lib/paypal";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Capture order to complete payment
  const { orderId } = req.body;

  const PaypalClient = client();
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  const response = await PaypalClient.execute(request);
  if (!response) {
    res.status(500);
  }

  // Update payment to PAID status once completed
  /*
  await prisma.payment.updateMany({
    where: {
      orderID,
    },
    data: {
      status: "PAID",
    },
  });
  */
  res.json({ ...response.result });
}
