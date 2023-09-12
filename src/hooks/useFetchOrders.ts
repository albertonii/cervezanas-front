"use client";

import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchOrders = async (
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
      business_orders!business_orders_order_id_fkey (
        *,
        order_items (
          *,
          product_pack_id (
            *
          )
        )
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

const useFetchOrders = (
  ownerId: string,
  currentPage: number,
  resultsPerPage: number
) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(ownerId, currentPage, resultsPerPage, supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchOrders;
