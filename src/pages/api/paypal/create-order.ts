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
  const { total, items } = req.body.body;

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

  try {
    console.log(request);

    const response = await PaypalClient.execute(request).catch((err: any) => {
      console.log(err);
    });

    if (response.statusCode !== 201) {
      res.status(500);
    }
    res.json({ orderId: response.result.id });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }

  //Once order is created store the data using Supabase client
  /*
  await prisma.payment.create({
    data: {
      orderID: response.result.id,
      status: "PENDING",
    },
  });
  */
}
