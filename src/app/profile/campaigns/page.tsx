import { Campaigns } from "../../../components/customLayout";
import { ROUTE_SIGNIN } from "../../../config";
import { ICampaign, IProduct } from "../../../lib/types.d";
import { createServerClient } from "../../../utils/supabaseServer";

export default async function CampaignPage() {
  const { campaigns, products } = await getCampaignData();

  return (
    <>
      <Campaigns campaigns={campaigns!} products={products!} />
    </>
  );
}

async function getCampaignData() {
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: ROUTE_SIGNIN,
        permanent: false,
      },
    };

  const { data: campaignsData, error: campaignsError } = await supabase
    .from("campaigns")
    .select(
      `
        *
      `
    )
    .eq("owner_id", session.user.id);

  if (campaignsError) throw campaignsError;

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

  return {
    campaigns: campaignsData as ICampaign[],
    products: productsData as IProduct[],
  };
  // }
}
