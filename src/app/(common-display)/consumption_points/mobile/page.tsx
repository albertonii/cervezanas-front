import { redirect } from "next/navigation";
import { VIEWS } from "../../../../constants";
import { ICPMobile } from "../../../../lib/types";
import { createServerClient } from "../../../../utils/supabaseServer";
import DisplayCPMobile from "./CPMobile";

export default async function CPMobilePage({ searchParams }: any) {
  const { id } = searchParams;

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
                    product_multimedia(p_principal)
                )
            )
        `
    )
    .eq("id", cpId);
  if (cpMobileError) console.error(cpMobileError);

  return cpMobile as ICPMobile[];
}
