import { redirect } from "next/navigation";
import { Campaigns } from "../../../components/customLayout";
import { VIEWS } from "../../../constants";
import { ICampaign, IProduct } from "../../../lib/types.d";
import { createServerClient } from "../../../utils/supabaseServer";

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
    redirect(VIEWS.ROUTE_SIGNIN);
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
    redirect(VIEWS.ROUTE_SIGNIN);
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
        product_pack (*)
      `
    )
    .eq("owner_id", session.user.id);

  if (productsError) throw productsError;

  return productsData as IProduct[];
}
