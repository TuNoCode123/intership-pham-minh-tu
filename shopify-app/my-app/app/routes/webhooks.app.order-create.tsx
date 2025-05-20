import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const res = await authenticate.webhook(request);
  console.log(res.payload);

  return new Response();
};
