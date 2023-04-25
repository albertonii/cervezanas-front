import { useQuery } from "react-query";
import { ICPFixed } from "../lib/types";
import { supabase } from "../utils/supabaseClient";

const fetchCPMobile = async (
  cpId: string,
  currentPage: number,
  pageRange: number
) => {
  const { data, error } = await supabase
    .from("cp_mobile")
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

const useFetchCPMobile = (
  cpId: string,
  currentPage: number,
  pageRange: number
) => {
  return useQuery<ICPFixed[]>({
    queryKey: ["cp_fixed"],
    queryFn: () => fetchCPMobile(cpId, currentPage, pageRange),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchCPMobile;
