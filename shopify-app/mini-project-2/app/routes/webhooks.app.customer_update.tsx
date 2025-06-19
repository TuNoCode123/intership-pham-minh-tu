import { ActionFunctionArgs, json } from "@remix-run/node";
import { CUSTOMER_QUEUE } from "app/constrant/queue";
import { getShop } from "app/helpers/getShop";
import { customerQueue } from "app/queues/jobs/customerQueue";
import customerService from "app/services/customer-service";
import { authenticate } from "app/shopify.server";
// import test from "node:test";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, shop } = await authenticate.webhook(request);
  console.log("customerPayload", payload);
  const getShopId = await getShop(shop);
  if (!getShopId) throw new Error("shopId not existed");
  const { id, email, first_name, last_name } = payload;
  await customerQueue.add(
    CUSTOMER_QUEUE.customerCreateOrUpdate,
    {
      customerId: `gid://shopify/Customer/${id}`,
      email,
      firstName: first_name,
      lastName: last_name,
      getShopId,
    },
    {
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 10,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
    },
  );
  console.log("add job update success");
  return json("update success", { status: 200 });
};
