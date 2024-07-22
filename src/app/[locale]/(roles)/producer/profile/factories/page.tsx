import { redirect } from 'next/navigation';
import readUserSession from '@/lib//actions';
import { Factories } from './Factories';

export default async function FactoriesPage() {
    //   const {} = await getFactoriesData();

    return (
        <>
            <Factories></Factories>
        </>
    );
}

async function getFactoriesData() {
    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    return {};
}
