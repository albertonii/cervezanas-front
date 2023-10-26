"use client";

import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { IProduct } from "../lib/types.d";

const deleteProductImgs = async (
  product: IProduct,
  supabase: SupabaseClient<any>
) => {
  // 1. Delete product multimedia images
  if (product.product_multimedia[0]) {
    const p_principal_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/articles/${product.id}/p_principal/${product.product_multimedia[0].p_principal}`;

    const { data, error } = await supabase.storage
      .from("products")
      .remove([p_principal_url]);

    if (error) throw error;
  }

  // 2. Delete awards images
  // 3. Delete product stock images

  return;
};

const useDeleteProductImgs = (product: IProduct) => {
  const { supabase } = useAuth();

  // return useQuery(["delete-product-imgs", product], deleteProductImgs);
  return null;
};

export default useDeleteProductImgs;
