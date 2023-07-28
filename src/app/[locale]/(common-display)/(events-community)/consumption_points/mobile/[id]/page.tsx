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

  const { data: cpMobile, error: cpMobileError } = await supabase
    .from("cp_mobile")
    .select(
      `
        *,
        cpm_products (
            *,
            product_pack_id (
              *, 
              product_id (
                id,
                name,
                description,
                type,
                beers (*),
                price,
                product_multimedia (p_principal)
              )
            )
        )
        `
    )
    .eq("id", cpId);

  if (cpMobileError) console.error(cpMobileError);

  return cpMobile as ICPMobile[];
}
