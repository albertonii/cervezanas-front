import InfoCPFixed from './InfoCPFixed';
import createServerClient from '@/utils/supabaseServer';
import { ICPFixed } from '@/lib/types/types';

export default async function CPFixedPage({ params }: any) {
    const { id: eventId, f_id } = params;
    const cpFixedData = getCPFixed(f_id);
    const [cpFixed] = await Promise.all([cpFixedData]);

    return (
        <>
            <InfoCPFixed cpFixed={cpFixed} eventId={eventId} />
        </>
    );
}

async function getCPFixed(cpId: string) {
    const supabase = await createServerClient();

    const { data: cpFixed, error: cpFixedError } = await supabase
        .from('cp_fixed')
        .select(
            `
            *,
            cpf_products!cpf_products_cp_id_fkey (
              *,
              cp_id,
              product_pack_id,
              product_packs!cpf_products_product_pack_id_fkey (
                *,
                products!product_packs_product_id_fkey (
                  *,
                  product_media!product_media_product_id_fkey (*)
                )
              )
            )
          `,
        )
        .eq('id', cpId)
        .single();

    if (cpFixedError) console.error(cpFixedError);

    return cpFixed as ICPFixed;
}
