import readUserSession from '@/lib//actions';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { IUserTable } from '@/lib//types/types';
import { ShoppingBasket } from './ShoppingBasket';

export default async function CheckoutPage() {
    const userData = getUser();
    const [user] = await Promise.all([userData]);

    return <>{user && <ShoppingBasket user={user} />}</>;
}

async function getUser() {
    const supabase = await createServerClient();
    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.id)
        .single();

    if (error) throw error;

    return data as IUserTable;
}

// async function getCheckout() {
//   const supabase = await createServerClient();

// Be careful when protecting pages. The server gets the user session from the cookies, which can be spoofed by anyone.
// const session = await readUserSession();

//   if (!session) {
// redirect('/signin');
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
