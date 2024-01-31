import Marketplace from './Marketplace';
import React from 'react';
import createServerClient from '../../../../utils/supabaseServer';
import { IProduct, IProductMultimedia } from '../../../../lib/types';

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
        beers!inner (
          *
        ),
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
        product_packs (*)
      `,
    )
    .eq('is_public', true);

  if (productsError) throw productsError;

  return productsData as IProduct[];
}
