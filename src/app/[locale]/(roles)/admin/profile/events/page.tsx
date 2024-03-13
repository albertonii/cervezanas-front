import { ICPFixed, ICPMobile } from '../../../../../../lib/types/types';
import createServerClient from '../../../../../../utils/supabaseServer';
import Events from './Events';

export default async function EventsPage() {
  const cpsMobileData = getCPMobileData();
  const cpsFixedData = getCPFixedData();
  const eventsCounterData = getEventsCounter();
  const [cpsMobile, cpsFixed, eventsCounter] = await Promise.all([
    cpsMobileData,
    cpsFixedData,
    eventsCounterData,
  ]);

  return (
    <Events cpsMobile={cpsMobile} cpsFixed={cpsFixed} counter={eventsCounter} />
  );
}

async function getCPMobileData() {
  const supabase = await createServerClient();

  const { data: cps, error: cpError } = await supabase
    .from('consumption_points')
    .select(
      `
        *,
        cp_mobile (*)
      `,
    );

  if (cpError) throw cpError;

  return cps[0]?.cp_mobile as ICPMobile[];
}

async function getCPFixedData() {
  const supabase = await createServerClient();

  const { data: cps, error: cpError } = await supabase
    .from('consumption_points')
    .select(
      `
        *,
        cp_fixed (*)
      `,
    );

  if (cpError) throw cpError;

  return cps[0]?.cp_fixed as ICPFixed[];
}

async function getEventsCounter() {
  const supabase = await createServerClient();

  const { count, error } = await supabase
    .from('events')
    .select('id', { count: 'exact' }); // Selecciona solo una columna y habilita el conteo

  if (error) throw error;

  return count as number | 0;
}
