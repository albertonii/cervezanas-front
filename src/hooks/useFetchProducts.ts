import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { supabase } from "../utils/supabaseClient";

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("beers")
    .select("name, description, lot_id, type");

  if (error) throw error;

  return data;
};

const useFetchProducts = () => {
  return useQuery("products", fetchProducts);
};

export default useFetchProducts;
