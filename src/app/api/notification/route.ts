import { NextResponse } from "next/server";
import { createServerClient } from "../../../utils/supabaseServer";
import { decodeBase64 } from "../../../utils/utils";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log(searchParams);
  const { Ds_MerchantParameters } = searchParams as any;

  console.log(Ds_MerchantParameters);
  //  as {
  //   Ds_MerchantParameters: string;
  //   Ds_SignatureVersion: string;
  //   Ds_Signature: string;
  // };

  const { Ds_Order: orderNumber } = JSON.parse(
    decodeBase64(Ds_MerchantParameters)
  );

  const supabase = createServerClient();

  // Update order status
  const { data, error } = await supabase.from("orders").select("*");
  if (error) console.error(error);

  console.log(data);
  return NextResponse.json({ message: "prueba" });
}
