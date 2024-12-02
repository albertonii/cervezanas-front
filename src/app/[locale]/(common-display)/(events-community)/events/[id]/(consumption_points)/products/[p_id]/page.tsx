import CPProduct from './CPProduct';
import createServerClient from '@/utils/supabaseServer';
import { IProduct } from '@/lib/types/types';
import { IConsumptionPointProduct } from '@/lib/types/consumptionPoints';

export default async function ProductId({ params }: any) {
    const { p_id } = params;

    const productData = await getProductData(p_id);
    const marketplaceProductsData = await getMarketplaceData();
    const [product, marketplaceProducts] = await Promise.all([
        productData,
        marketplaceProductsData,
    ]);

    return (
        <>
            <CPProduct
                CPMProduct={product}
                marketplaceProducts={marketplaceProducts}
            />
        </>
    );
}

async function getProductData(cpId: string) {
    // Create authenticated Supabase Client
    const supabase = await createServerClient();

    const { data: cpmProducts, error: productError } = await supabase
        .from('cp_products')
        .select(
            `
                *,
                product_packs (
                    *,
                    products (
                        *,
                        likes (*)
                    )
                ),
                cp_id (*)
            `,
        )
        .eq('id', cpId)
        .single();

    if (productError) throw productError;
    return cpmProducts as IConsumptionPointProduct;
}

async function getMarketplaceData() {
    // Create authenticated Supabase Client
    const supabase = await createServerClient();

    const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(
            `
                id,
                price,
                product_media (
                *
                )
            `,
        )
        .eq('is_public', true);

    if (productsError) throw productsError;

    return productsData as IProduct[];
}
