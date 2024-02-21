import '@fortawesome/fontawesome-svg-core/styles.css';
import { redirect } from 'next/navigation';
import { VIEWS } from '../../../../../constants';
import { IBillingAddress, IAddress } from '../../../../../lib/types';
import createServerClient from '../../../../../utils/supabaseServer';
import { ShoppingBasket } from './ShoppingBasket';

export default async function CheckoutPage() {
  return (
    <>
      <ShoppingBasket />
    </>
  );
}

// async function getCheckout() {
//   const supabase = await createServerClient();

// Be careful when protecting pages. The server gets the user session from the cookies, which can be spoofed by anyone.
// const session = await readUserSession();

//   if (!session) {
//     redirect(VIEWS.SIGN_IN);
//   }

//   const { data: userData, error: usersError } = await supabase
//     .from("users")
//     .select(`*, shipping_info(*), billing_info(*)`)
//     .eq("id", session.id);

//   if (usersError) throw usersError;

//   return {
//     shippingAddresses: userData[0]?.shipping_info as IAddress[],
//     billingAddresses: userData[0]?.billing_info as IBillingAddress[],
//   };
// }
