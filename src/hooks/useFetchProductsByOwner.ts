import { useQuery } from "react-query";
import { IProduct } from "../lib/types";
import { supabase } from "../utils/supabaseClient";

const fetchProductsByOwner = async (
  ownerId: string,
  currentPage: number,
  pageRange: number,
  isArchived: boolean
) => {
  const { data, error } = await supabase
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
        `,
      {
        count: "exact",
      }
    )
    .eq("owner_id", ownerId)
    .eq("is_archived", isArchived)
    .range((currentPage - 1) * pageRange, currentPage * pageRange - 1);

  if (error) throw error;

  return data;
};

const useFetchProducts = (
  ownerId: string,
  currentPage: number,
  pageRange: number,
  isArchived: boolean
) => {
  return useQuery<IProduct[]>({
    queryKey: ["products_owner"],
    queryFn: () =>
      fetchProductsByOwner(ownerId, currentPage, pageRange, isArchived),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchProducts;
