import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);
  const productId = payload?.id;

  console.log("Product ID:", productId);

  if (productId) {
    const pID = productId.toString();
    const existingLog = await db.logDeleteProduct.findFirst({
      where: { productId: pID },
    });
    if (existingLog) {
      return new Response(null, { status: 403 });
    }

    await db.logDeleteProduct.create({
      data: {
        productId: pID,
        shopName: shop,
      },
    });
  }
  return new Response(null, { status: 200 });
};
