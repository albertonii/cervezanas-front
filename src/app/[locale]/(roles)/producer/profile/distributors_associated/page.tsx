import Distributors from './Distributors';
import readUserSession from '@/lib/actions';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';

export default async function page() {
    const counterData = getAssociatedDistributorsCounter();
    const [counter] = await Promise.all([counterData]);

    return <Distributors counter={counter} />;
}

async function getAssociatedDistributorsCounter() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { count, error } = await supabase
        .from('distribution_contracts')
        .select('producer_id', { count: 'exact' }) // Selecciona solo una columna y habilita el conteo
        .eq('producer_id', session.id);

    if (error) throw error;

    return count as number | 0;
}
