import readUserSession from '@/lib/actions';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import BreweryConfiguration from './BreweryConfiguration';

export default async function BreweryPage() {
    const breweriesCounterData = getBreweriesCounter();
    const [breweriesCounter] = await Promise.all([breweriesCounterData]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BreweryConfiguration counter={breweriesCounter} />
        </Suspense>
    );
}

async function getBreweriesCounter() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { count, error } = await supabase
        .from('breweries')
        .select('id', { count: 'exact' }) // Selecciona solo una columna y habilita el conteo
        .eq('producer_id', session.id);

    if (error) throw error;

    return count as number | 0;
}
