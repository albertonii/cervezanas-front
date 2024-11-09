import readUserSession from '@/lib/actions';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ConfigureProducts } from './ConfigureProducts';

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
        .select('id', { count: 'exact' }); // Selecciona solo una columna y habilita el conteo

    if (error) throw error;

    return count as number | 0;
}
