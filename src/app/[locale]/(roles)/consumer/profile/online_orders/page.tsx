import readUserSession from '@/lib/actions';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Orders } from './Orders';

export default async function OrdersPage() {
    const ordersCounterData = getOrdersCounter();
    const [ordersCounter] = await Promise.all([ordersCounterData]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Orders counter={ordersCounter} />
        </Suspense>
    );
}

async function getOrdersCounter() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { count, error } = await supabase
        .from('orders')
        .select('id', { count: 'exact' }) // Selecciona solo una columna y habilita el conteo
        .eq('owner_id', session.id);

    if (error) throw error;

    return count as number | 0;
}
