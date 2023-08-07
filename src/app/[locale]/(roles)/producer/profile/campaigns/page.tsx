import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { ICampaign, IProduct } from "../../../../../../lib/types";
import { createServerClient } from "../../../../../../utils/supabaseServer";
import { Campaigns } from "./Campaigns";

export default async function CampaignPage() {
  const productsData = await getProductsData();
  const campaignsData = await getCampaignData();
  const [products, campaigns] = await Promise.all([
    productsData,
    campaignsData,
  ]);

  return (
    <>
      <Campaigns campaigns={campaigns ?? []} products={products ?? []} />
    </>
  );
}

async function getCampaignData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }
  const { data: campaignsData, error: campaignsError } = await supabase
    .from("campaigns")
    .select(
      `
        *
      `
    )
    .eq("owner_id", session.user.id);

  if (campaignsError) throw campaignsError;

  return campaignsData as ICampaign[];
}

async function getProductsData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select(
      `
        *, 
        product_multimedia (*),
        product_inventory (*),
        likes (*),
        product_lot (*),
        beers (*), 
        product_packs (*)
      `
    )
    .eq("owner_id", session.user.id);

  if (productsError) throw productsError;

  return productsData as IProduct[];
}
