import type { NextApiRequest, NextApiResponse } from "next";
import nock from "nock";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).send("not found");
  }
  nock.disableNetConnect();
  return res.status(200).send("Disabled all HTTP requests");
}
