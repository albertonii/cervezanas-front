import readUserSession from '@/lib/actions';
import createServerClient from '@/utils/supabaseServer';
import { ConfigureProducts } from './ConfigureProducts';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function ProductsPage() {
    const productsCounterData = getProductsCounter();
    const [productsCounter] = await Promise.all([productsCounterData]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfigureProducts counter={productsCounter} />
        </Suspense>
    );
}

async function getProductsCounter() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { count, error } = await supabase
        .from('products')
        .select('id', { count: 'exact' }) // Selecciona solo una columna y habilita el conteo
        .eq('owner_id', session.id);

    if (error) throw error;

    return count as number | 0;
}
