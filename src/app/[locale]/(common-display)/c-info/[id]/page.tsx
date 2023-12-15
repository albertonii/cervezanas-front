import React from "react";
import createServerClient from "../../../../../utils/supabaseServer";
import { IUser } from "../../../../../lib/types";
import ConsumerInformation from "./ConsumerInformation";

export default async function page({ params }: any) {
  const { id } = params;

  const consumerData = await getDistributorProfile(id);
  const [consumer] = await Promise.all([consumerData]);

  return <ConsumerInformation consumer={consumer} />;
}

async function getDistributorProfile(consumerId: string) {
  const supabase = await createServerClient();

  const { data: consumer, error: consumerError } = await supabase
    .from("users")
    .select(
      `
        *
      `
    )
    .eq("id", consumerId)
    .single();

  if (consumerError) throw consumerError;

  return consumer as IUser;
}
