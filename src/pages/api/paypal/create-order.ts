import paypal from "@paypal/checkout-server-sdk";
import client from "../../../lib/paypal";
import type { NextApiRequest, NextApiResponse } from "next";
import { ICartItem } from "../../../lib/types.d";
import { supabase } from "../../../utils/supabaseClient";

interface ICreateOrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      total,
      items,
      user_id,
      username,
      billing_info_id,
      shipping_info_id,
    } = req.body.body;

    const storeItems: ICreateOrderItem[] = [];

    if (!items) return res.status(500).emit("error", "No items in cart");

    //Get store items from Supabase
    const itemPromises = await items.map(async (item: ICartItem) => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price")
        .eq("id", item.id);

      if (error) {
        res.status(500);
      }

      if (!data) return;
      const sItems = { ...data[0], quantity: item.quantity };
      storeItems.push(sItems);
    });

    // Use `Promise.all` to wait for all the promises to resolve
    await Promise.all(itemPromises);

    const PaypalClient = client();

    const request = new paypal.orders.OrdersCreateRequest();

    request.headers["Prefer"] = "return=representation";
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: total,
            breakdown: {
              item_total: {
                currency_code: "EUR",
                value: total,
              },
            },
          },
          items: storeItems.map((item: ICreateOrderItem) => {
            return {
              name: item.name,
              unit_amount: {
                currency_code: "EUR",
                value: item.price,
              },
              quantity: item.quantity,
            };
          }),
        },
      ],
    });

    // your client gets a response with the order id
    const response = await PaypalClient.execute(request).catch((err: any) => {
      console.error(err);
    });

    const orderId = response.result.id;

    if (response.statusCode !== 201) {
      res.status(500);
    }

    //Once order is created store the data using Supabase client
     await supabase
      .from("orders")
      .insert({
        owner_id: user_id,
        total: total,
        customer_name: username,
        status: "order_placed",
        tracking_id: "123456789",
        payment_method: "paypal",
        order_number: orderId,
        shipping_info_id,
        billing_info_id,
        issue_date: new Date().toISOString(),
        estimated_date: new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24 * 3
        ).toISOString(), // 3 days
      })
      .select("*");

    const resJson = {
      id: orderId,
    };
    res.json(resJson);
  }
}
