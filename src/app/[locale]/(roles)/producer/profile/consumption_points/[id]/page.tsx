import createServerClient from '@/utils/supabaseServer';
import ConsumptionPointInformation from './ConsumptionPointInformation';
import { ICPMobile } from '@/lib/types/consumptionPoints';

export default async function Page({ params }: any) {
    const { id } = params;

    const cpMobileData = await getCPMobileInformation(id);
    const [cpMobile] = await Promise.all([cpMobileData]);

    return <ConsumptionPointInformation cpMobile={cpMobile} />;
}

async function getCPMobileInformation(cpMobileId: string) {
    const supabase = await createServerClient();

    const { data: cpMobile, error } = await supabase
        .from('cp_mobile')
        .select('*')
        .eq('id', cpMobileId)
        .single();

    if (error) console.error(error);

    return cpMobile as ICPMobile;
}
