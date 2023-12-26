"use client";

import { useQuery } from "react-query";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { IBusinessOrder } from "../lib/types";

const fetchBusinessOrdersByDistributorId = async (
  distributorId: string,
  currentPage: number,
  resultsPerPage: number,
  supabase: any
) => {
  const { data, error } = await supabase
    .from("business_orders")
    .select(
      `
        *,
        orders (*)
      `
    )
    .eq("distributor_id", distributorId)
    .range((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage - 1)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as IBusinessOrder[];
};

const useFetchBusinessOrdersByDistributorId = (
  distributorId: string,
  currentPage: number,
  resultsPerPage: number
) => {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ["business_orders_by_distributor_id"],
    queryFn: () =>
      fetchBusinessOrdersByDistributorId(
        distributorId,
        currentPage,
        resultsPerPage,
        supabase
      ),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchBusinessOrdersByDistributorId;
