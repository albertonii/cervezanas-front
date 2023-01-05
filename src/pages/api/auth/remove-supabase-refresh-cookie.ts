import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res
    .setHeader(
      "Set-Cookie",
      "sb-refresh-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    )
    .send({});
}
