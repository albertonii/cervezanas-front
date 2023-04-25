import { useQuery } from "react-query";
import { ICPFixed, IOrder } from "../lib/types";
import { supabase } from "../utils/supabaseClient";

const fetchCPOrders = async (
  ownerId: string,
  currentPage: number,
  pageRange: number
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
