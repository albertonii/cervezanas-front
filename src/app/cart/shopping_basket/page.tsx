import "@fortawesome/fontawesome-svg-core/styles.css";
import { ROUTE_SIGNIN } from "../../../config";
import { IBillingAddress, IShippingAddress } from "../../../lib/types.d";
import { createServerClient } from "../../../utils/supabaseServer";
import Checkout from "./Checkout";

export default async function CheckoutPage() {
  const { shippingAddresses, billingAddresses } = await getCheckout();
  return (
    <>
      <Checkout
        shippingAddresses={shippingAddresses ?? []}
        billingAddresses={billingAddresses ?? []}
      />
    </>
  );
}

async function getCheckout() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: ROUTE_SIGNIN,
        permanent: false,
      },
    };

  const { data: userData, error: usersError } = await supabase
    .from("users")
    .select(`*, shipping_info(*), billing_info(*)`)
    .eq("id", session.user.id);

  if (usersError) throw usersError;

  return {
    shippingAddresses: userData[0]?.shipping_info as IShippingAddress[],
    billingAddresses: userData[0]?.billing_info as IBillingAddress[],
  };
}
