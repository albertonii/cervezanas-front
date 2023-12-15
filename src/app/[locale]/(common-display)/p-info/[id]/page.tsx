import React from "react";
import ProducerInformation from "./ProducerInformation";
import createServerClient from "../../../../../utils/supabaseServer";
import { IProducerUser } from "../../../../../lib/types";

export default async function page({ params }: any) {
  const { id } = params;

  const producerData = await getProducerProfile(id);
  const [producer] = await Promise.all([producerData]);

  return <ProducerInformation producer={producer} />;
}

async function getProducerProfile(producerId: string) {
  const supabase = await createServerClient();

  const { data: producer, error: producerError } = await supabase
    .from("producer_user")
    .select(
      `
       *
      `
    )
    .eq("user", producerId)
    .single();

  // const { data: producer, error: producerError } = await supabase
  //   .from("users")
  //   .select(
  //     `
  //   *,
  //   producer_user (
  //     *
  //   ),
  //   profile_location (
  //     *
  //   )
  //   `
  //   )
  //   .eq("id", producerId)
  //   .single();

  if (producerError) throw producerError;

  return producer as IProducerUser;
}
