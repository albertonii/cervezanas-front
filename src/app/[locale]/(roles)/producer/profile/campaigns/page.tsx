import { redirect } from "next/navigation";
import { VIEWS } from "../../../../../../constants";
import { ICampaign, IProduct } from "../../../../../../lib/types.d";
import createServerClient from "../../../../../../utils/supabaseServer";
import readUserSession from "../../../../../actions";
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
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await readUserSession();

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
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await readUserSession();

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
        product_lots (*),
        beers (*), 
        product_packs (*)
      `
    )
    .eq("owner_id", session.user.id);

  if (productsError) throw productsError;

  return productsData as IProduct[];
}
