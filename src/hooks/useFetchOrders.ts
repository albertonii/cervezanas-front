"use client";

import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchCPOrders = async (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number,
  supabase: any
) => {
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
        order_items (*)
      )
    `
    )
    .eq("owner_id", ownerId)
    .range(
      (currentPage - 1) * resultsPerPage,
      currentPage * resultsPerPage - 1
    );

  if (error) throw error;
  return data;
};

const useFetchCPOrders = (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number
) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetchCPOrders(ownerId, currentPage, resultsPerPage, supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPOrders;
