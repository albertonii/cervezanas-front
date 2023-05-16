"use client";

import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";
import { IOrder } from "../lib/types.d";

const fetchCPOrders = async (
  ownerId: string,
  currentPage: number,
  pageRange: number
) => {
  const { supabase } = useSupabase();

  const { data, error } = await supabase
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
    .eq("owner_id", ownerId)
    .range((currentPage - 1) * pageRange, currentPage * pageRange - 1);

  if (error) throw error;
  return data;
};

const useFetchCPOrders = (
  ownerId: string,
  currentPage: number,
  pageRange: number
) => {
  return useQuery<IOrder[]>({
    queryKey: ["orders"],
    queryFn: () => fetchCPOrders(ownerId, currentPage, pageRange),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPOrders;
