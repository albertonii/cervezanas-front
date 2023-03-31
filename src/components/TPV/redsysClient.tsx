import {
  createRedsysAPI,
  Currency,
  SANDBOX_URLS,
  TRANSACTION_TYPES,
} from "redsys-easy";

interface OrderPaymentStatus {
  orderId: string;
  amount: string;
  currency: Currency;
  status: "PENDING_PAYMENT" | "PAYMENT_FAILED" | "PAYMENT_SUCCEDED";
}

export const { createRedirectForm, processRestNotification } = createRedsysAPI({
  urls: SANDBOX_URLS,
  secretKey: "sq7HjrUOBfKmC576ILgskD5srU870gJ7",
});

const port = 3000;
export const endpointRedsys = `http://localhost:${port}`;

export const successRedirectPath = "/checkout/success/";
export const errorRedirectPath = "/checkout/error";
export const notificationPath = "/api/notification";

export const merchantInfo = {
  DS_MERCHANT_MERCHANTCODE: "097839427",
  DS_MERCHANT_TERMINAL: "1",
  DS_MERCHANT_TRANSACTIONTYPE: TRANSACTION_TYPES.AUTHORIZATION, // '0'
  DS_MERCHANT_MERCHANTNAME: "Cervezanas M&M SL",
  DS_MERCHANT_MERCHANTURL: `${endpointRedsys}${notificationPath}`,
  DS_MERCHANT_URLOK: `${endpointRedsys}${successRedirectPath}`,
  DS_MERCHANT_URLKO: `${endpointRedsys}${errorRedirectPath}`,
} as const;
