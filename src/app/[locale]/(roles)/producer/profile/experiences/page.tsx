import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { VIEWS } from '../../../../../../constants';
import createServerClient from '../../../../../../utils/supabaseServer';
import readUserSession from '../../../../../../lib/actions';
import { IExperience } from '../../../../../../lib/types';
import Experiences from './Experiences';

export default async function EventsPage() {
  const experiencesData = getExperiencesData();
  const experiencesCounterData = getExperiencesCounter();
  const [experiences, experiencesCounter] = await Promise.all([
    experiencesData,
    experiencesCounterData,
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Experiences experiences={experiences} counter={experiencesCounter} />
    </Suspense>
  );
}

async function getExperiencesData() {
  const supabase = await createServerClient();

  const session = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data, error } = await supabase
    .from('experiences')
    .select(
      `
        *,
        bm_questions: beer_master_questions (
          id,
          question,
          experience_id,
          answers: beer_master_answers (*)
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
    redirect(VIEWS.SIGN_IN);
  }

  const { count, error } = await supabase
    .from('experiences')
    .select('id', { count: 'exact' }) // Selecciona solo una columna y habilita el conteo
    .eq('producer_id', session.id);

  if (error) throw error;

  return count as number | 0;
}
