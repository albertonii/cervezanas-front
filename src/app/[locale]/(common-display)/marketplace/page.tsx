import Marketplace from './Marketplace';
import createServerClient from '@/utils/supabaseServer';
import React from 'react';
import { IProduct } from '@/lib//types/types';

export default async function MarketPlacePage() {
    const productsData = getMarketplaceProducts();
    const [products] = await Promise.all([productsData]);

    return (
        <>
            <Marketplace products={products ?? []} />
        </>
    );
}

async function getMarketplaceProducts() {
    const supabase = await createServerClient();

    const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(
            `
              *,
              product_multimedia (
                *,
                p_principal
              ),
              product_inventory (
                *
              ),
              likes (
                *,
                id
              ), 
              reviews (
                *,
                overall
              ),
              product_packs (*),
              awards (*),
              beers (*)
            `,
        )
        .eq('is_public', true)
        .not('product_packs', 'is', null);

    // const { data: productsData, error: productsError } = await supabase
    //     .from('products')
    //     .select(
    //         `
    //           *,
    //           beers!inner (  // INNER JOIN
    //             *
    //           ),
    //           ...
    //         `,
    //     )
    //     .eq('is_public', true);

    if (productsError) throw productsError;

    return productsData as IProduct[];
}
