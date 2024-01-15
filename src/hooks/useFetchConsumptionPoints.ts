import { useQuery } from "react-query";
import { Database } from "../lib/schema";
import { IConsumptionPoints } from "../lib/types";
import { useAuth } from "../app/[locale]/Auth/useAuth";
import { SupabaseClient } from "@supabase/supabase-js";

const fetchConsumptionPoints = async (
  //   currentPage: number,
  //   resultsPerPage: number,
  supabase: SupabaseClient<Database>
) => {
  const { data, error } = await supabase
    .from("consumption_points")
    .select(
      `
        *,
        cp_mobile (*)
      `
    )
    // .range((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage - 1)
    .select();
  if (error) throw error;
  return data as IConsumptionPoints[];
};

const useFetchConsumptionPoints = () =>
  //   currentPage: number,
  //   resultsPerPage: number
  {
    const { supabase } = useAuth();

    return useQuery({
      queryKey: ["consumption_points"],
      //   queryKey: ["consumption_points", currentPage, resultsPerPage],
      queryFn: () => fetchConsumptionPoints(supabase),
      //   fetchConsumptionPoints(currentPage, resultsPerPage, supabase),
      enabled: true,
      refetchOnWindowFocus: false,
    });
  };

export default useFetchConsumptionPoints;
