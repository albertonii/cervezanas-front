import type { NextApiRequest, NextApiResponse } from "next";
import paypal from "@paypal/checkout-server-sdk";
import client from "../../../lib/paypal";
import { supabase } from "../../../utils/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    //Capture order to complete payment
    const { order_id: orderId } = req.body.body;

    const PaypalClient = client();
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
      const capture = await PaypalClient.execute(request);
      if (!capture) {
        res.status(500);
      }

      // Update payment to PAID status once completed
      await supabase
        .from("orders")
        .update({
          status: "PAID",
        })
        .eq("id", orderId);

      const result = capture.result;
      const resJson = {
        result,
      };

      res.json(resJson);
    } catch (error) {
      console.error(error);
      return res.send(500);
    }
  }
}
