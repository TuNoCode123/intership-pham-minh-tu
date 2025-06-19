import { json, type ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import customerService from "app/services/customer-service";
import redeemService from "app/services/redeem-service";
import { getShop } from "app/helpers/getShop";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, shop } = await authenticate.webhook(request);
  const getShopId = await getShop(shop);
  if (!getShopId) throw new Error("shopId not existed");
  console.log("payloadOrder", payload);
  const {
    total_line_items_price,
    customer: { id },
    line_items,
    discount_codes,
  } = payload;
  if (
    Array.isArray(discount_codes) &&
    discount_codes &&
    discount_codes.length > 0
  ) {
    const data = discount_codes[0];
    const { code } = data;
    await redeemService.changeStatusCouponToUsed(code);
  }
  // const
  const result = {} as any;
  line_items.map((item: any) => {
    result[item.product_id] = (result[item.product_id] || 0) + 1;
  });
  const mappedValue = Object.entries(result).map(([key, value]) => ({
    productId: `gid://shopify/Product/${key}`,
    orderNumber: value ? +value : 0,
  }));
  const response = await customerService.getPoint({
    customerId: `gid://shopify/Customer/${id}`,
    amount: total_line_items_price,
    productList: mappedValue,
    shopId: getShopId,
  });
  const { ST, ...restObject } = response;
  return json(restObject, { status: ST });
};
