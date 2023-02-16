import type { NextApiRequest, NextApiResponse } from "next";
import nock from "nock";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  nock.disableNetConnect();
  return res.status(200).send("Disabled all HTTP requests");
}
