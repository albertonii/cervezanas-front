import { useQuery } from "react-query";
import { useUser } from "../components/Auth/UserContext";
import { supabase } from "../utils/supabaseClient";

const getProfile = async (id?: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("username, given_name, lastname, birthdate")
    .eq("id", id);

  if (error) {
    alert(error.message);
    throw error;
  }

  return data;
};

export default function useProfile() {
  const { user } = useUser();
  /*return useQuery(["profile", "123"], () =>
    axiosPrivate.get("/v1/trainings/" + "123")
  );*/

  return useQuery(["profile", getProfile(user?.id)], {
    enabled: !!user,
  });
}
