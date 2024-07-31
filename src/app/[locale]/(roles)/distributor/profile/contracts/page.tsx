import readUserSession from '@/lib/actions';
import createServerClient from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';
import Contracts from './Contracts';

export default async function Page() {
    const contractsCounter = await getContractsCounter();

    return <Contracts counter={contractsCounter} />;
}

async function getContractsCounter() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { count, error } = await supabase
        .from('distribution_contracts')
        .select('distributor_id', { count: 'exact' })
        .eq('distributor_id', session.id);

    if (error) throw error;

    return count as number | 0;
}
