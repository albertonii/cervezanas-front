import { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie } from "nookies";
import { supabase } from "../../../utils/supabaseClient";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
    return res.status(401).json({ error: error.message });
  }

  destroyCookie({ res }, "sb-refresh-token", { path: "/" });

  res
    .setHeader(
      "Set-Cookie",
      "sb-refresh-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    )
    .send({ success: true });
}
