import PDProduct from './PDProduct';
import createServerClient from '@/utils/supabaseServer';
import { IProduct } from '@/lib//types/types';

export default async function ProductPage({ params }: any) {
    const { id } = params;

    const productData = await getProductData(id);

    const [product] = await Promise.all([productData]);

    return <PDProduct product={product} />;
}

async function getProductData(productId: string) {
    const supabase = await createServerClient();

    const { data: product, error: productError } = await supabase
        .from('products')
        .select(
            `
            *,
            brewery_id,
            beers (
              *
            ),
            product_multimedia (
              *,
              p_principal,
              p_back,
              p_extra_1,
              p_extra_2,
              p_extra_3
            ),
            product_packs (*),
            awards (*),
            reviews (
              *,
              users (
                id,
                created_at,
                username,
                avatar_url
              )
            ),
            box_packs (
              *,
              box_pack_items (
                id,
                box_pack_id,
                product_id,
                quantity,
                slots_per_product,
                products (
                  *,
                  product_multimedia (*),
                  beers (
                    *
                  )
                )
              )
            ),
            likes (
              id,
              created_at,
              owner_id,
              product_id
            ),
            breweries (
              id,
              created_at,
              producer_id,
              name,
              foundation_year,
              history,
              description,
              logo,
              country,
              region,
              sub_region,
              city,
              address,
              website,
              rrss_ig,
              rrss_fb,
              rrss_linkedin,
              types_of_beers_produced,
              special_processing_methods,
              guided_tours
            )
          `,
        )
        .eq('id', productId)
        .single();

    if (productError) throw productError;

    return product as IProduct;
}
