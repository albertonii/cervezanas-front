import { createRedsysAPI, SANDBOX_URLS, TRANSACTION_TYPES } from "redsys-easy";

/*
interface OrderPaymentStatus {
  orderId: string;
  amount: string;
  currency: Currency;
  status: "PENDING_PAYMENT" | "PAYMENT_FAILED" | "PAYMENT_SUCCEDED";
}
*/

export const { createRedirectForm, processRestNotification } = createRedsysAPI({
  urls: SANDBOX_URLS,
  secretKey: process.env.NEXT_PUBLIC_DS_SIGNATURE_SECRET ?? "",
});

const env = process.env.NODE_ENV;

let host = "";

if (env === "production") {
  host = "http://localhost:3000";
  // host = "https://cervezanas-front.vercel.app:443"
} else if (env === "development") {
  host = "http://localhost:3000";
} else {
  host = "http://localhost:3000";
}

export const endpointRedsys = `${host}`;

export const successRedirectPath = "/es/checkout/success/";
export const errorRedirectPath = "/es/checkout/error";
export const notificationPath = "/api/notification";

export const successEventRedirectPath = "/es/checkout/event/success/";
export const errorEventRedirectPath = "/es/checkout/event/error";
export const notificationEventPath = "/api/notification";

export const merchantInfo = {
  DS_MERCHANT_MERCHANTNAME: "Cervezanas M&M SL",
  DS_MERCHANT_MERCHANTCODE: "097839427",
  DS_MERCHANT_MERCHANTURL: `https://cervezanas-front.vercel.app/api/notification`,
  DS_MERCHANT_TERMINAL: "1",
  DS_MERCHANT_TRANSACTIONTYPE: TRANSACTION_TYPES.AUTHORIZATION, // '0'
  DS_MERCHANT_URLOK: `${endpointRedsys}${successRedirectPath}`,
  DS_MERCHANT_URLKO: `${endpointRedsys}${errorRedirectPath}`,
} as const;

export const eventMerchantInfo = {
  DS_MERCHANT_MERCHANTCODE: "097839427",
  DS_MERCHANT_TERMINAL: "1",
  DS_MERCHANT_TRANSACTIONTYPE: TRANSACTION_TYPES.AUTHORIZATION, // '0'
  DS_MERCHANT_MERCHANTNAME: "Cervezanas M&M SL",
  DS_MERCHANT_MERCHANTURL: `https://cervezanas-front.vercel.app/api/notification`,
  // DS_MERCHANT_MERCHANTURL: `${endpointRedsys}${notificationEventPath}`,
  DS_MERCHANT_URLOK: `${endpointRedsys}${successEventRedirectPath}`,
  DS_MERCHANT_URLKO: `${endpointRedsys}${errorEventRedirectPath}`,
} as const;