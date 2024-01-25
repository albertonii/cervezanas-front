import InfoCPMobile from "./InfoCPMobile";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../../../../constants";
import { ICPMobile } from "../../../../../../../../../lib/types";
import readUserSession from "../../../../../../../../../lib/actions";
import createServerClient from "../../../../../../../../../utils/supabaseServer";

export default async function CPMobilePage({ params }: any) {
  const { id: eventId, m_id } = params;
  const cpMobileData = getCPMobile(m_id);
  const [cpMobile] = await Promise.all([cpMobileData]);

  return (
    <>
      <InfoCPMobile cpMobile={cpMobile} eventId={eventId} />
    </>
  );
}

async function getCPMobile(cpId: string) {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: cpsMobile, error: cpMobileError } = await supabase
    .from("cp_mobile")
    .select(
      `
        *,
        cpm_products!cpm_products_cp_id_fkey (
          *,
          cp_id,
          product_pack_id,
          product_packs!cpm_products_product_pack_id_fkey (
            *,
            products!product_packs_product_id_fkey (
              id,
              name,
              description,
              type,
              product_multimedia!product_multimedia_product_id_fkey (p_principal)
            )
          )
        )
      `
    )
    .eq("id", cpId)
    .single();

  if (cpMobileError) console.error(cpMobileError);

  return cpsMobile as ICPMobile;
}
