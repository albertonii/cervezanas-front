import createServerClient from '@/utils/supabaseServer';
import readUserSession from '@/lib//actions';
import Experiences from './Experiences';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { IExperience } from '@/lib//types/quiz';

export default async function EventsPage() {
    const experiencesData = getExperiencesData();
    const experiencesCounterData = getExperiencesCounter();
    const [experiences, experiencesCounter] = await Promise.all([
        experiencesData,
        experiencesCounterData,
    ]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Experiences
                experiences={experiences}
                counter={experiencesCounter}
            />
        </Suspense>
    );
}

async function getExperiencesData() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { data, error } = await supabase
        .from('experiences')
        .select(
            `
          *,
          bm_questions (
            id,
            question,
            experience_id,
            product_id,
            correct_answer,
            incorrect_answers,
            difficulty,
            type,
            products (id, name)
          )
          `,
        )
        .eq('producer_id', session.id);

    if (error) throw error;
    return data as IExperience[];
}

async function getExperiencesCounter() {
    const supabase = await createServerClient();

    const session = await readUserSession();

    if (!session) {
        redirect('/signin');
    }

    const { count, error } = await supabase
        .from('experiences')
        .select('id', { count: 'exact' }) // Selecciona solo una columna y habilita el conteo
        .eq('producer_id', session.id);

    if (error) throw error;

    return count as number | 0;
}
