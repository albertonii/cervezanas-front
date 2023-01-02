import { useQuery } from "react-query";
import { supabase } from "../utils/supabaseClient";

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("beers")
    .select("id, name, description, type");

  if (error) throw error;

  return data;
};

const useFetchProducts = () => {
  return useQuery("products", fetchProducts);
};

export default useFetchProducts;
