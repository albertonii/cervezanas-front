import { useQuery } from "react-query";
import { supabase } from "../utils/supabaseClient";
import { IProduct } from "../lib/types.d";

const deleteProductImgs = async (product: IProduct) => {
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
  return useQuery(["delete-product-imgs", product], deleteProductImgs);
};

export default useDeleteProductImgs;
