import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabaseClient";
import { destroyCookie } from "nookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
    return res.status(401).json({ error: error.message });
  }

  destroyCookie({ res }, "sb-access-token", { path: "/" });

  res
    .setHeader(
      "Set-Cookie",
      "sb-access-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    )
    .send({ success: true });
}
