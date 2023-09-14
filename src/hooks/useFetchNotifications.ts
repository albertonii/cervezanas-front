"use client";

import { useQuery } from "react-query";
import { useSupabase } from "../context/SupabaseProvider";

const fetchNotifications = async (ownerId: string, supabase: any) => {
  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
      *
    `
    )
    .eq("user_id", ownerId)
    .eq("read", false);

  if (error) throw error;
  return data;
};

const useFetchNotifications = (ownerId: string) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(ownerId, supabase),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchNotifications;
