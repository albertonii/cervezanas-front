"use client";

import { useQuery } from "react-query";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { IOrder } from "../lib/types";

const fetchOrdersByDistributorId = async (
  distributorId: string,
  currentPage: number,
  resultsPerPage: number,
  supabase: any
) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        *, 
        business_orders (
          *
        )
      `
    )
    .eq("business_orders.distributor_id", [distributorId])
    .range((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage - 1)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as IOrder[];
};

const useFetchOrdersByDistributorId = (
  distributorId: string,
  currentPage: number,
  resultsPerPage: number
) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["orders_by_distributor_id"],
    queryFn: () =>
      fetchOrdersByDistributorId(
        distributorId,
        currentPage,
        resultsPerPage,
        supabase
      ),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchOrdersByDistributorId;