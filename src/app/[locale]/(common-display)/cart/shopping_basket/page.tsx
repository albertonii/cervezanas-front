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
