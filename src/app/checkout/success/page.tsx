import { VIEWS } from "../../../constants";
import { createServerClient } from "../../../utils/supabaseServer";
import { decodeBase64 } from "../../../utils/utils";
import SuccessCheckout from "./SuccessCheckout";

export default async function SuccessPage({
  params,
}: {
  params: { slug: any };
}) {
  const { slug } = params;
  const orderData = await getSuccessData(slug);
  const [order] = await Promise.all([orderData]);
  const products = order?.products;

  return (
    <>
      <SuccessCheckout
        order={order[0]}
        isError={false}
        products={products ?? []}
      />
    </>
  );
}

async function getSuccessData(slug: any) {
  const { Ds_MerchantParameters } = slug.query as {
    Ds_MerchantParameters: string;
    Ds_SignatureVersion: string;
    Ds_Signature: string;
  };

  const { Ds_Order: orderNumber } = JSON.parse(
    decodeBase64(Ds_MerchantParameters)
  );

  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: VIEWS.ROUTE_SIGNIN,
        permanent: false,
      },
    };

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select(
      `
      *,
      shipping_info(id, *),
      billing_info(id, *),
      products(
        id, 
        name, 
        price,
        product_multimedia(*),
        order_item(*)
      )
    `
    )
    .eq("order_number", orderNumber);

  if (orderError) {
    console.error(orderError.message);
    return {
      props: {
        isError: true,
        order: null,
        products: null,
      },
    };
  }

  if (!orderData || orderData.length === 0) {
    return {
      props: {
        order: null,
      },
    };
  }

  return orderData[0];
}
