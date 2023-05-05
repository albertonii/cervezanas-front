import axios from "axios";
import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { supabase } from "../../utils/supabaseClient";
import { formatPaypal } from "../../utils";
import { useShoppingCart } from "../Context";
import { ICartItem } from "../../lib/types.d";

interface Props {
  total: number;
  items: ICartItem[];
}

export function Paypal({ total, items }: Props) {
  const { clearCart } = useShoppingCart();

  const createOrder = async () => {
    return axios
      .post("/api/paypal/create-order", {
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: {
          items,
          total: formatPaypal(total),
        },
      })
      .then((res) => {
        console.log(res);
        if (res) return res;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleApprove = async (data: any, actions: any) => {
    const order = await actions.order.capture();
    const orderId = order.id;

    return axios
      .post("/api/paypal/capture-order", {
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({
          orderId: orderId,
        }),
      })
      .then((res) => {
        console.log(res);
        if (res) return res;
      })
      .catch((err) => {
        console.error(err);
      });

    /*
    await supabase
      .from("orders")
      .update({
        status: "paid",
        paypal_order_id: order.id,
      })
      // .match({ id: orderId });
      .match({ id: "orderId" });
      */

    // clearCart();
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
        onError={(err: any) => console.error(err)}
      />
    </>
  );
}
