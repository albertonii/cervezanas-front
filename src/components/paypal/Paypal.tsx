import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { supabase } from "../../utils/supabaseClient";

export function Paypal() {
  /*
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
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: "10.00",
                  currency_code: "USD",
                },
              },
            ],
          });
        }}
        onApprove={handleApprove}
      />
    </>
  );
  */
  return <></>;
}
