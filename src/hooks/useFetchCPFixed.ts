import { useQuery } from "react-query";
import { ICPFixed } from "../lib/types.d";
import { supabase } from "../utils/supabaseClient";

const fetchCPFixed = async (
  cpId: string,
  currentPage: number,
  pageRange: number
) => {
  const { data, error } = await supabase
    .from("cp_fixed")
    .select(
      `
      *
    `
    )
    .eq("cp_id", cpId)
    .range((currentPage - 1) * pageRange, currentPage * pageRange - 1);

  if (error) throw error;

  return data;
};

const useFetchCPFixed = (
  cpId: string,
  currentPage: number,
  pageRange: number
) => {
  return useQuery<ICPFixed[]>({
    queryKey: ["cp_fixed"],
    queryFn: () => fetchCPFixed(cpId, currentPage, pageRange),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPFixed;
