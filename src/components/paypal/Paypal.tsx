import axios from "axios";
import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { formatPaypal } from "../../utils";
import { useShoppingCart } from "../Context";
import { ICartItem } from "../../lib/types.d";
import { useAuth } from "../Auth";
import { useRouter } from "next/navigation";

interface Props {
  total: number;
  items: ICartItem[];
  billing_info_id: string;
  shipping_info_id: string;
}

const successRedirectPath = "/checkout/success/";

export function Paypal({
  total,
  items,
  billing_info_id,
  shipping_info_id,
}: Props) {
  const { clearCart } = useShoppingCart();
  const { user } = useAuth();
  if (!user) return null;

  const router = useRouter();

  const createOrder = async () => {
    return await axios
      .post("/api/paypal/create-order", {
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: {
          items,
          total: formatPaypal(total),
          user_id: user.id,
          username: user.username,
          billing_info_id,
          shipping_info_id,
        },
      })
      .then((res) => {
        const orderId = res.data.id;
        if (!orderId) throw new Error("No order id");
        return orderId;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleApprove = async (data: any) => {
    const orderId = data.orderID;

    return axios
      .post("/api/paypal/capture-order", {
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: {
          order_id: orderId,
        },
      })
      .then((res) => {
        // clearCart();
        if (res.data !== 500) {
          // router.push(`${successRedirectPath}/${orderId}`);
          return res;
        }
      })
      .catch((err) => {
        console.error(err);
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
        onCancel={(data: any) => console.log(data)}
        onError={(err: any) => console.error(err)}
      />
    </>
  );
}
