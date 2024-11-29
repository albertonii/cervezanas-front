import createServerClient from '@/utils/supabaseServer';
import ConsumptionPointInformation from './ConsumptionPointInformation';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';

export default async function Page({ params }: any) {
    const { id } = params;

    const cpData = await getCPInformation(id);
    const [cp] = await Promise.all([cpData]);

    return <ConsumptionPointInformation cp={cp} />;
}

async function getCPInformation(cpMobileId: string) {
    const supabase = await createServerClient();

    const { data: cp, error } = await supabase
        .from('cp_events')
        .select(
            `
                *,
                cp (*)
            `,
        )
        .eq('id', cpMobileId)
        .single();

    if (error) console.error(error);

    return cp as IConsumptionPointEvent;
}
