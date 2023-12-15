import React from "react";
import { IBusinessOrder } from "../../../../../../../lib/types";
import createServerClient from "../../../../../../../utils/supabaseServer";

interface PageProps {
  params: { id: string; locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function page({ params }: PageProps) {
  const { id } = params;
  const bOrderData = await getBusinessOrderData(id);

  const [bOrder] = await Promise.all([bOrderData]);

  return <div>page</div>;
}

async function getBusinessOrderData(bOrderId: string) {
  const supabase = await createServerClient();

  const { data: product, error: productError } = await supabase
    .from("business_orders")
    .select(
      `
        *
      `
    )
    .eq("id", bOrderId)
    .single();

  if (productError) throw productError;

  return product as IBusinessOrder;
}
