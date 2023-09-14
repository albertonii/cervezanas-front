import InfoCPMobile from "./InfoCPMobile";
import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../../constants";
import { ICPMobile } from "../../../../../../../lib/types.d";
import { createServerClient } from "../../../../../../../utils/supabaseServer";

export default async function CPMobilePage({ params }: any) {
  const { id } = params;
  const cpMobileData = getCPMobile(id);
  const [cpMobile] = await Promise.all([cpMobileData]);

  return (
    <>
      <InfoCPMobile cpMobile={cpMobile[0]} />
    </>
  );
}

async function getCPMobile(cpId: string) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

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
            product_id,
            products!product_packs_product_id_fkey (
              id,
              created_at,
              name,
              description,
              type,
              is_public,
              discount_percent,
              discount_code,
              price,
              campaign_id,
              is_archived,
              category,
              is_monthly,
              owner_id,
              beers!beers_product_id_fkey (
                *
              ),
              product_multimedia!product_multimedia_product_id_fkey (p_principal)
            )
          )
        )
      `
    )
    .eq("id", cpId);

  if (cpMobileError) console.error(cpMobileError);

  return cpsMobile as ICPMobile[];
}
