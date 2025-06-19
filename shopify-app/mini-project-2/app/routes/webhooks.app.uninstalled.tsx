import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received11111 ${topic} webhook for ${shop}`);

  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  // If this webhook already ran, the session may have been deleted previously.
  if (session) {
    console.log("delete11111");
    const resShop = db.shop.update({
      where: { domain: shop },
      data: {
        accessToken: undefined,
        status: "uninstalled",
      },
    });
    const resSession = db.session.deleteMany({ where: { shop } });
    await Promise.all([resShop, resSession]);
  }

  return new Response();
};
