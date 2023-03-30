import {
  createRedsysAPI,
  TRANSACTION_TYPES,
  randomTransactionId,
  SANDBOX_URLS,
  isResponseCodeOk,
  CURRENCIES,
} from "redsys-easy";

import type { ResponseJSONSuccess, Currency } from "redsys-easy";
import { NextApiRequest, NextApiResponse } from "next";
import Decimal from "decimal.js";

interface OrderPaymentStatus {
  orderId: string;
  amount: string;
  currency: Currency;
  status: "PENDING_PAYMENT" | "PAYMENT_FAILED" | "PAYMENT_SUCCEDED";
}

const { createRedirectForm, processRestNotification } = createRedsysAPI({
  urls: SANDBOX_URLS,
  secretKey: "sq7HjrUOBfKmC576ILgskD5srU870gJ7",
});

const merchantInfo = {
  DS_MERCHANT_MERCHANTCODE: "097839427",
  DS_MERCHANT_TERMINAL: "1",
} as const;

const port = 3344;
const endpoint = `http://example.com:${port}`;

const successRedirectPath = "/success";
const errorRedirectPath = "/error";
const notificationPath = "/api/notification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const amount = req.query["amount"] as string;
    // const orderId = req.query["order_id"] as string;

    // Use productIds to calculate amount and currency
    const { totalAmount, currency } = {
      // Never use floats for money
      totalAmount: amount,
      currency: "EUR",
    } as const;

    const orderId = randomTransactionId();

    const currencyInfo = CURRENCIES[currency];

    // Convert 49.99€ -> 4999
    const redsysAmount = new Decimal(totalAmount)
      .mul(Math.pow(10, currencyInfo.decimals))
      .round()
      .toFixed(0);

    // Convert EUR -> 978
    const redsysCurrency = currencyInfo.num;

    const form = createRedirectForm({
      ...merchantInfo,
      DS_MERCHANT_MERCHANTCODE: "097839427",
      DS_MERCHANT_TERMINAL: "1",
      DS_MERCHANT_TRANSACTIONTYPE: TRANSACTION_TYPES.AUTHORIZATION, // '0'
      DS_MERCHANT_ORDER: orderId,
      // amount in smallest currency unit(cents)
      DS_MERCHANT_AMOUNT: redsysAmount,
      DS_MERCHANT_CURRENCY: redsysCurrency,
      DS_MERCHANT_MERCHANTNAME: "Cervezanas M&M SL",
      DS_MERCHANT_MERCHANTURL: `${endpoint}${notificationPath}`,
      DS_MERCHANT_URLOK: `${endpoint}${successRedirectPath}`,
      DS_MERCHANT_URLKO: `${endpoint}${errorRedirectPath}`,
    });
    return res.status(200).json({ form });

    /*
    const json = [
      "<!DOCTYPE html>",
      "<html>",
      "<body>",
      `<p>Payment for order ${orderId}, ${totalAmount} ${currency}</p>`,
      `<form action="${form.url}" method="post" target="_blank">`,
      `  <input type="hidden" id="Ds_SignatureVersion" name="Ds_SignatureVersion" value="${form.body.Ds_SignatureVersion}" />`,
      `  <input type="hidden" id="Ds_MerchantParameters" name="Ds_MerchantParameters" value="${form.body.Ds_MerchantParameters}" />`,
      `  <input type="hidden" id="Ds_Signature" name="Ds_Signature" value="${form.body.Ds_Signature}"/>`,
      '  <input type="submit" value="Pay with credit card" />',
      "</form>",
      "</body>",
      "</html>",
    ].join("\n");

    return res.status(200).json({ json });
    */
  }
}
