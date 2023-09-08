import React from "react";
import DistributorInformation from "./ProducerInformation";
import { createServerClient } from "../../../../../utils/supabaseServer";
import ProducerInformation from "./ProducerInformation";

export default async function page({ params }: any) {
  const { id } = params;

  const producerData = await getProducerProfile(id);
  const [producer] = await Promise.all([producerData]);

  return <ProducerInformation producer={producer} />;
}

async function getProducerProfile(producerId: string) {
  const supabase = createServerClient();

  const { data: producer, error: producerError } = await supabase
    .from("users")
    .select(
      `
      *,
      producer_user (
        *
      ),
      profile_location (
        *
      )
      `
    )
    .eq("id", producerId);

  if (producerError) throw producerError;

  return producer[0];
}
