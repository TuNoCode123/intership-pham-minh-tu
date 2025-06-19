import { ActionFunctionArgs, json } from "@remix-run/node";
import { CUSTOMER_QUEUE } from "app/constrant/queue";
import { REDIS } from "app/constrant/redis";
// import { CUSTOMER_QUEUE } from "app/constrant/queue";
import { AppError } from "app/helpers/error";
import { getLargestUpdateTime } from "app/helpers/getLargestUpdateTime";
import { getShop } from "app/helpers/getShop";
import { customerAllQueue } from "app/queues/jobs/customerQueue";
import redisService from "app/services/redis-service";
// import { customerQueue } from "app/queues/jobs/customerQueue";
// import customerService from "app/services/customer-service";
import { authenticate } from "app/shopify.server";
// import test from "node:test";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("get all customer");
  const { shop, admin } = await authenticate.webhook(request);
  const getShopid = await getShop(shop);
  if (!getShopid) throw new Error("shopId not existed");
  if (!admin) {
    console.log("No admin client found");
    throw new Error("No admin client found");
  }
  const response = await admin.graphql(
    `query {
  currentBulkOperation {
    id
    status
    errorCode
    createdAt
    completedAt
    objectCount
    fileSize
    url
    partialDataUrl
  }
}`,
  );
  const result = await response.json();
  const {
    data: {
      currentBulkOperation: { url },
    },
  } = result;
  if (!url) {
    await customerAllQueue.add(
      CUSTOMER_QUEUE.notHaveCustomer,
      {
        shopId: getShopid,
      },
      {
        jobId: `notHaveCustomer-${getShopid}`,
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
    return json("sync success", { status: 200 });
  }

  const text = await fetch(url).then((r) => r.text());
  const arrCustomers = text.trim().split("\n");
  await Promise.all(
    arrCustomers.map((line) => {
      const customer = JSON.parse(line);
      return customerAllQueue.add(
        CUSTOMER_QUEUE.customerSync,
        {
          ...customer,
          shopId: getShopid,
        },
        {
          jobId: `customer-${customer?.id?.split("/")[customer?.id?.split("/").length - 1]}`,
          removeOnComplete: true,
          removeOnFail: false,
          attempts: 10,
          backoff: {
            type: "exponential",
            delay: 3000,
          },
        },
      );
    }),
  );
  const lastCustomer = JSON.parse(
    arrCustomers[arrCustomers.length - 1],
  )?.id?.split("/");

  const asyncFunc = getLargestUpdateTime(arrCustomers, getShopid);

  const setId = redisService.setKey({
    key: `lastId-${getShopid}`,
    value: `customer-${lastCustomer[lastCustomer.length - 1]}`,
    time: 120,
  });
  const [idRs, ...rest] = await Promise.all([setId, ...asyncFunc]);
  if (idRs.EC == 1) {
    console.log("set redis error");
    return json("set redis error", { status: 500 });
  }

  console.log("add job update success");
  return json("update success", { status: 200 });
};
