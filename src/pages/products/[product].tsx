import { useRouter } from "next/router";
import React from "react";
import { supabase } from "../../utils/supabaseClient";

interface Props {
  product: any[];
}

export default function ProductId(props: Props) {
  // const router = useRouter();

  const { product } = props;
  const p = product[0];

  return (
    <div>
      <span>{p.id}</span>
      <br />
      <span>{p.name}</span>
      <br />
      <span>{p.price}</span>
      <br />
      <span>{p.aroma}</span>
    </div>
  );
}

export async function getServerSideProps(context: { params: any }) {
  const { params } = context;
  const { product } = params;

  let { data, error } = await supabase
    .from("beers")
    .select("*")
    .eq("id", product);

  if (error) throw error;
  return {
    props: {
      product: data,
    },
  };
}
