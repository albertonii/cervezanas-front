import { PayPalButtons } from "@paypal/react-paypal-js";
import { IOrder } from "../../lib/types";
import { supabase } from "../../utils/supabaseClient";

export function Paypal() {
  return (
    <>
      <PayPalButtons
        fundingSource="paypal"
        style={{
          layout: "vertical",
          shape: "rect",
        }}
        createOrder={async (data: any, actions: any) => {
          //   const { data: orderRes, error: orderError } = await supabase
          //     .from("orders")
          //     .insert({
          //       owner_id: order.owner_id,
          //       total: order.total,
          //       customer_name: "manolito",
          //       status: "order_placed",
          //       tracking_id: "123456789",
          //       issue_date: new Date().toISOString(),
          //       estimated_date: new Date(
          //         new Date().getTime() + 1000 * 60 * 60 * 24 * 3
          //       ).toISOString(), // 3 days
          //       payment_method: "credit_card",
          //       order_number: order.order_number,
          //       shipping_info_id: order.shipping_info.id,
          //       billing_info_id: order.billing_info.id,
          //     })
          //     .select("id");

          //   if (orderError) throw orderError;

          //   const response = await fetch("http://localhost:3000/orders", {
          //     method: "POST",
          //   });
          // const details = await response.json();
          // console.log(details);
          // return details.id;
          console.log(data);
          return data;
        }}
        onApprove={async (data: any, actions: any) => {
          const response = await fetch(
            `http://localhost:9597/orders/${data.orderID}/capture`,
            {
              method: "POST",
            }
          );
          const details = await response.json();
          // Three cases to handle:
          //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          //   (2) Other non-recoverable errors -> Show a failure message
          //   (3) Successful transaction -> Show confirmation or thank you

          // This example reads a v2/checkout/orders capture response, propagated from the server
          // You could use a different API or structure for your 'orderData'

          const errorDetail =
            Array.isArray(details.details) && details.details[0];
          if (errorDetail && errorDetail.issue === "INSTRUMENT_DECLINED") {
            return actions.restart(); // Recoverable state, per:
            // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
          }

          if (errorDetail) {
            let msg = "Sorry, your transaction could not be processed.";
            if (errorDetail.description) msg += "" + errorDetail.description;
            if (details.debug_id) msg += " (" + details.debug_id + ")";
            return alert(msg); // Show a failure message (try to avoid alerts in production environments)
          }

          // Successful capture! For demo purposes:
          console.log(
            "Capture result",
            details,
            JSON.stringify(details, null, 2)
          );
          const transaction = details.purchase_units[0].payments.captures[0];
          alert(
            "Transaction " +
              transaction.status +
              ": " +
              transaction.id +
              "See console for all available details"
          );
        }}
      />
    </>
  );
}
