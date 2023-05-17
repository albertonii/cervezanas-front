"use client";

import { useQuery } from "react-query";
import { useSupabase } from "../components/Context/SupabaseProvider";

const fetchNotifications = async (ownerId: string) => {
  const { supabase } = useSupabase();
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
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(ownerId),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchNotifications;
