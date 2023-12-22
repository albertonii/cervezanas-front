import { redirect } from "next/navigation";
import React from "react";
import { VIEWS } from "../../../../../../constants";
import { IConsumptionPoints } from "../../../../../../lib/types";
import createServerClient from "../../../../../../utils/supabaseServer";
import ContractsCPS from "./ContractsCPS";

export default async function CPsContractsPage() {
  const cpsContracts = await getCPsContracts();

  return <ContractsCPS cpsContracts={cpsContracts} />;
}

async function getCPsContracts() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: cpsContract, error: profileError } = await supabase
    .from("consumption_points")
    .select(
      `
        *,
        users (*)
      `
    );

  if (profileError) throw profileError;

  return cpsContract as IConsumptionPoints[];
}
