import { useQuery } from "react-query";
import { INotification } from "../lib/types";
import { supabase } from "../utils/supabaseClient";

const fetchNotifications = async (ownerId: string) => {
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
  return useQuery<INotification[]>({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(ownerId),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useFetchNotifications;
