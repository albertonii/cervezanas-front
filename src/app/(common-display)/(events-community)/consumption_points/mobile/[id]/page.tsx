import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { ICPMobile } from "../../../../../../lib/types.d";
import { createServerClient } from "../../../../../../utils/supabaseServer";
import DisplayCPMobile from "./DisplayCPMobile";

export default async function CPMobilePage({ params }: any) {
  const { id } = params;

  const cpMobileData = getCPMobile(id);
  const [cpMobile] = await Promise.all([cpMobileData]);
  return (
    <>
      <DisplayCPMobile cpMobile={cpMobile[0]} />
    </>
  );
}

async function getCPMobile(cpId: string) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.ROUTE_SIGNIN);
  }

  const { data: cpMobile, error: cpMobileError } = await supabase
    .from("cp_mobile")
    .select(
      `
            *,
            cpm_products (
                *,
                product_id (*,
                    product_multimedia(p_principal), 
                    beers (*)
                )
            )
        `
    )
    .eq("id", cpId);
  if (cpMobileError) console.error(cpMobileError);

  return cpMobile as ICPMobile[];
}
