import { NextPage } from "next";
import React, { useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

const MarketPlace: NextPage = () => {
  useEffect(() => {
    const fetchPublicProducts = async () => {
      let { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_public", "true");

      if (error) throw error;
      console.log(data);
      return data;
    };

    fetchPublicProducts();
  }, []);

  return <div>marketPlace</div>;
};

export default MarketPlace;
