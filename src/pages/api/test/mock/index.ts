import type { NextApiRequest, NextApiResponse } from "next";
import nock from "nock";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const {
    method: methodParam,
    hostname: hostnameParam,
    path: pathParam,
    statusCode: statusCodeParam,
    query: queryParam,
    body,
  } = JSON.parse(req.body);

  const method = (methodParam as string).toUpperCase();
  const hostname = hostnameParam as string;
  const path = pathParam as string;
  const statusCode = Number(statusCodeParam);

  const message = `nock will intercept: ${method} ${hostname}${path} with query ${JSON.stringify(
    queryParam
  )},respond with status: ${statusCode}, and body: ${JSON.stringify(body)}`;

  nock(hostname)
    .persist()
    .intercept(path, method)
    .query(queryParam)
    .reply(statusCode, body);

  return res.status(200).send(message);
}
