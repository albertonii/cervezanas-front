import Beerme from './Beerme';
import { IConsumptionPoints } from '../../../../lib/types';
import createServerClient from '../../../../utils/supabaseServer';

export default async function BeerMePage() {
  const cpsData = getCPsData();
  const [cps] = await Promise.all([cpsData]);

  if (!cps) return null;

  return (
    <>
      <Beerme cps={cps} />
    </>
  );
}

async function getCPsData() {
  const supabase = await createServerClient();

  const { data: cps, error: cpsError } = await supabase
    .from('consumption_points')
    .select(
      `
      *,
      cp_fixed (
        *
      ),
      cp_mobile (
        *
      )
    `,
    );
  if (cpsError) throw cpsError;

  return cps as IConsumptionPoints[];
}
