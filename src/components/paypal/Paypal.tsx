import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";

import { supabase } from "../../utils/supabaseClient";
import { formatPaypal } from "../../utils";

interface Props {
  total: number;
}

export function Paypal({ total }: Props) {
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

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: formatPaypal(total),
            currency_code: "EUR",
          },
        },
      ],
    });
  };

  return (
    <>
      <PayPalButtons
        fundingSource={FUNDING.PAYPAL}
        style={{
          layout: "vertical",
          shape: "rect",
        }}
        createOrder={createOrder}
        onApprove={handleApprove}
      />
    </>
  );
}
