import type { NextApiRequest, NextApiResponse } from "next";
import nock from "nock";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  nock.cleanAll();

  return res
    .status(200)
    .send("Enabled HTTP requests. Removed all nock interceptors.");
}
