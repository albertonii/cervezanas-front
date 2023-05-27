import "@fortawesome/fontawesome-svg-core/styles.css";
import Checkout from "./Checkout";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../constants";
import { IBillingAddress, IShippingAddress } from "../../../lib/types.d";
import { createServerClient } from "../../../utils/supabaseServer";

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

  if (!session) {
    redirect(VIEWS.ROUTE_SIGNIN);
  }

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
