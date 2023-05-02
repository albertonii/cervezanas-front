import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { randomTransactionId } from "redsys-easy";

import { supabase } from "../../utils/supabaseClient";

interface Props {
  total: number;
}

export function Paypal({ total }: Props) {
  const orderNumber = randomTransactionId();

  const handleApprove = async (data: any, actions: any) => {
    const order = await actions.order.capture();
    await supabase
      .from("orders")
      .update({
        status: "paid",
        paypal_order_id: order.id,
      })
      // .match({ id: orderId });
      .match({ id: "orderId" });
    // Handle success
  };

  return (
    <>
      <PayPalButtons
        fundingSource={FUNDING.PAYPAL}
        style={{
          layout: "vertical",
          shape: "rect",
        }}
        createOrder={(data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total,
                  currency_code: "EUR",
                },
              },
            ],
          });
        }}
        onApprove={handleApprove}
      />
    </>
  );
}
